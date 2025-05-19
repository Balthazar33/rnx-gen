import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { exec } from "child_process";
import { createPromptModule } from "inquirer";

import {
  consoleDone,
  consoleNote,
  consoleError,
  consoleCreate,
  consoleUpdate,
  doesFileExist,
  getFlavorConfig,
  consoleDryRunMessage,
} from "../helpers.js";
import {
  envFileMappings,
  buildScriptMappings,
  envPromptConfig,
  appNameGetterExpression,
  envTypesFileContent,
} from "../constants.js";

export const createEnv = async (options) => {
  // Environments to be added-----------------------------------------------
  let selectionsResult;
  const prompt = createPromptModule?.();
  await prompt([envPromptConfig])
    .then(({ selections }) => {
      selectionsResult = selections;
    })
    .catch(() => {});
  if (!selectionsResult) {
    return;
  }
  const allEnvs = ["production", ...(selectionsResult ?? [])];
  console.log("Selection:", chalk`{rgb(0, 255, 179) ${allEnvs.join(", ")}}`);
  console.log("");
  //------------------------------------------------------------------------
  if (options?.dryRun) {
    executeInDryRunMode();
  } else {
    executeInNormalMode();
  }
  async function executeInNormalMode() {
    /**
     * Updating android/app/build.gradle
     */
    try {
      // Adding env mapping to android/app/build.gradle-------------------------
      const gradlePath = path.join(
        process.cwd(),
        "android",
        "app",
        "build.gradle"
      );
      const gradleContent = fs.readFileSync(gradlePath, "utf8");
      let lines = gradleContent.split("\n");
      const merged = allEnvs.reduce(
        (a, b) => a + (envFileMappings[b] ?? ""),
        ""
      );
      const finalString = `
project.ext.envConfigFiles = [
${merged}
]

apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"`;
      lines.splice(2, 0, finalString); // inserting mapping after the second line
      //----------------------------------------------------------------------

      // Inserting JsonSlurper import------------------------------------------
      let lastApplyIndex = -1;
      lines.forEach((line, index) => {
        if (line.trim().startsWith("apply")) {
          lastApplyIndex = index;
        }
      });
      const slurperImport = "\nimport groovy.json.JsonSlurper";
      // Whether the import already exists (unlikely)
      const alreadyExists = lines.some((line) => line.includes("JsonSlurper"));
      if (!alreadyExists && lastApplyIndex !== -1) {
        lines.splice(lastApplyIndex + 1, 0, slurperImport);
      }
      // -----------------------------------------------------------------------

      // Inserting app name getter------------------------------------------
      let androidBeginIndex = -1;
      lines.forEach((line, index) => {
        if (
          line.trim().startsWith("android {") ||
          line.trim().startsWith("android{")
        ) {
          androidBeginIndex = index;
        }
      });
      if (androidBeginIndex !== -1 && androidBeginIndex - 1 >= 0) {
        lines.splice(androidBeginIndex - 1, 0, appNameGetterExpression);
      }
      //------------------------------------------------------------------------

      // Inserting matching fallbacks-------------------------------------------
      let buildTypesStart = -1;
      let buildTypesEnd = -1;
      let debugStart = -1;
      let debugEnd = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("buildTypes")) {
          buildTypesStart = i;
          // Finding the end of buildTypes
          let braceCount = 0;
          for (let j = i; j < lines.length; j++) {
            const line = lines[j];
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            if (braceCount === 0) {
              buildTypesEnd = j;
              break;
            }
          }
          break;
        }
        if (
          buildTypesStart !== -1 &&
          debugStart === -1 &&
          lines[i].includes("debug")
        ) {
          debugStart = i;
        }
        if (debugStart !== -1 && i > debugStart) {
          if (lines[i].includes("}")) {
            debugEnd = i;
            break;
          }
        }
      }
      const fallbackLine = `            matchingFallbacks = ['debug', 'release']`;
      let hasFallbackLine = lines.some((line) =>
        line.includes("matchingFallbacks")
      );
      if (!hasFallbackLine && debugEnd !== -1) {
        lines.splice(debugEnd, 0, fallbackLine);
        buildTypesEnd += 1;
      }
      //------------------------------------------------------------------------

      // Adding product flavors-------------------------------------------------
      const productFlavorMappings = {
        production: getFlavorConfig("production"),
        staging: getFlavorConfig("staging"),
        development: getFlavorConfig("development"),
        qa: getFlavorConfig("qa"),
        uat: getFlavorConfig("uat"),
      };
      const mergedFlavors = allEnvs.reduce(
        (a, b) => a + (productFlavorMappings?.[b] ?? ""),
        ""
      );
      const finalFlavorsString = `
    flavorDimensions "default"
    productFlavors {
${mergedFlavors}
    }`;
      if (buildTypesEnd !== -1) {
        lines.splice(buildTypesEnd + 1, 0, finalFlavorsString);
      }
      fs.writeFileSync(gradlePath, lines.join("\n"), "utf8");
      consoleUpdate("./android/app/build.gradle");
      //------------------------------------------------------------------------
    } catch (error) {
      consoleError("Could not update build.gradle");
    }

    // Adding build scripts---------------------------------------------------
    try {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJsonParsed = await JSON.parse(
        fs.readFileSync(packageJsonPath, "utf8")
      );
      packageJsonParsed.scripts = packageJsonParsed.scripts || {};
      allEnvs.forEach((envmt) => {
        packageJsonParsed.scripts[buildScriptMappings[envmt].key] =
          buildScriptMappings[envmt].value;
      });
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJsonParsed, null, 2) + "\n",
        "utf8"
      );
      consoleUpdate("./package.json");
    } catch (error) {
      consoleError("Could not update package.json");
    }
    //------------------------------------------------------------------------

    // Creating .d.ts & .env and files----------------------------------------
    const envFileTypesFileName = "envTypes.d.ts";
    const typesFile = path.join(process.cwd(), envFileTypesFileName);
    await fs.writeFile(typesFile, envTypesFileContent);
    consoleCreate(envFileTypesFileName);
    await Promise.all(
      allEnvs.map(async (envmt) => {
        const envFile = path.join(process.cwd(), `.env.${envmt}`);
        if (await doesFileExist(envFile)) {
          consoleNote(`.env.${envmt} exists already. Skipping creation...`);
        } else {
          // Adding dummy API key
          await fs.writeFile(
            envFile,
            `DUMMY_API_KEY=https://myapi.${envmt}.com\n`
          );
          consoleCreate(`./.env.${envmt}`);
        }
      })
    );
    //------------------------------------------------------------------------

    // Install react-native-config--------------------------------------------
    console.log("Installing react-native-config...");
    const spinner = ora().start();
    try {
      exec("npm i react-native-config", () => {
        spinner.stop();
        consoleDone();
      });
    } catch (error) {
      spinner.stop();
      consoleError("Could not install react-native-config");
    }
    //------------------------------------------------------------------------
  }
  async function executeInDryRunMode() {
    consoleUpdate("./android/app/build.gradle");
    consoleUpdate("./package.json");
    consoleCreate("./envTypes.d.ts");
    await Promise.all(
      allEnvs.map(async (envmt) => {
        const envFile = path.join(process.cwd(), `.env.${envmt}`);
        if (await doesFileExist(envFile)) {
          consoleNote(`.env.${envmt} exists already. Skipping creation...`);
        } else {
          consoleCreate(`./.env.${envmt}`);
        }
      })
    );
    consoleDryRunMessage();
  }
};
