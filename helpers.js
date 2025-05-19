import { promises as fs, readFileSync } from "fs";
import { exec } from "child_process";
import chalk from "chalk";
import path from "path";

const doesFileExist = async (filePath) => {
  try {
    await fs.access(filePath);
    return true; // Exists
  } catch (error) {
    return false; // Doesn't exist
  }
};

const iFileNameValid = (string) => {
  return /^[A-Za-z][A-Za-z0-9-]*$/.test(string);
};

const consoleDone = () => {
  console.log(chalk`
{rgb(0, 255, 251) Done!}`);
};

const consoleDryRunMessage = () => {
  console.log(
    chalk`
{rgb(255, 225, 0) Command executed with dry-run enabled; no files were created}`
  );
};

const consoleCreate = (filename) => {
  console.log(chalk`{rgb(0, 255, 179) Create:} ${path.normalize(filename)}`);
};

const consoleUpdate = (filename) => {
  console.log(chalk`{rgb(0, 166, 255) Update:} ${path.normalize(filename)}`);
};

const consoleError = (message) => {
  console.log(chalk`{rgb(255, 55, 0) Error:} ${message}`);
};

const consoleNote = (message) => {
  console.log(chalk`{rgb(255, 225, 0) Note:} ${message}`);
};

function getReactNativeVersion() {
  try {
    const packageJson = JSON.parse(readFileSync("package.json", "utf-8"));
    return (
      packageJson.dependencies["react-native"] ||
      packageJson.devDependencies["react-native"]
    );
  } catch {
    return null;
  }
}

function getReactVersion() {
  try {
    const packageJson = JSON.parse(readFileSync("package.json", "utf-8"));
    return (
      packageJson.dependencies["react"] || packageJson.devDependencies["react"]
    );
  } catch {
    return null;
  }
}

function getPeerDependencies(callback) {
  exec(
    "npm info @testing-library/react-native peerDependencies --json",
    (error, stdout) => {
      if (error) {
        callback(null);
        return;
      }
      try {
        const peerDeps = JSON.parse(stdout);
        callback(peerDeps);
      } catch (parseError) {
        callback(null);
      }
    }
  );
}

const tab8 = " ".repeat(8);
const tab12 = " ".repeat(12);
/**
 *  Get product flavor config for the specified environment
 * @param {string} envmt - Environment
 * @returns string
 */
const getFlavorConfig = (envmt) => {
  if (envmt === "production") {
    return (
      tab8 +
      "production {\n" +
      tab12 +
      "applicationId defaultConfig.applicationId\n" +
      tab12 +
      'resValue "string", "build_config_package", "${defaultConfig.applicationId}"\n' +
      tab12 +
      'resValue "string", "app_name", appName\n' +
      tab8 +
      "}"
    );
  } else {
    let appName =
      envmt === "staging"
        ? "STAGE ${appName}"
        : envmt === "development"
          ? "DEV ${appName}"
          : envmt === "qa"
            ? "QA ${appName}"
            : "UAT ${appName}";
    return (
      "\n" +
      tab8 +
      envmt +
      " {\n" +
      tab12 +
      "applicationIdSuffix " +
      `".${envmt}"` +
      "\n" +
      tab12 +
      'resValue "string", "build_config_package", "${defaultConfig.applicationId}"\n' +
      tab12 +
      'resValue "string", "app_name", ' +
      `"${appName}"` +
      "\n" +
      tab8 +
      "}"
    );
  }
};

export {
  doesFileExist,
  consoleDone,
  consoleCreate,
  iFileNameValid,
  consoleError,
  consoleDryRunMessage,
  consoleUpdate,
  consoleNote,
  getReactNativeVersion,
  getReactVersion,
  getPeerDependencies,
  getFlavorConfig,
};
