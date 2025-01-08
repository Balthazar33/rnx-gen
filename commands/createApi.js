import fs from "fs-extra";
import path from "path";
import { createPromptModule } from "inquirer";
import { exec } from "child_process";
import ora from "ora";
import {
  doesFileExist,
  consoleDone,
  consoleCreate,
  iFileNameValid,
  consoleDryRunMessage,
  consoleError,
  consoleNote,
} from "../helpers.js";
import { RTK_QUERY_API_NOTE } from "../constants.js";

export const createApi = async (name, options) => {
  if (options?.path && !options?.path?.startsWith("src")) {
    consoleError("Path must begin with 'src'");
    return;
  }
  if (!iFileNameValid(name)) {
    consoleError(`Invalid file name: ${name}`);
    return;
  }
  if (!options.keepName) {
    if (!name.toLowerCase().endsWith("Api")) {
      name = name + "Api";
    }
  }
  let basePath = path.normalize("src/services/api");
  if (options?.path) {
    basePath = path.normalize(options?.path);
  }
  /*
   * Do not create a separate folder for the api if --no-dir option is passed.
   */
  const dir = options?.dir
    ? path.join(process.cwd(), basePath, name)
    : path.join(process.cwd(), basePath);
  const apiFile = path.join(dir, `${name}.ts`);

  if (options?.dryRun) {
    executeInDryRunMode();
  } else {
    executeInNormalMode();
  }

  async function executeInNormalMode() {
    // Creating directory, if doesn't exist----------------------------------------
    if ((await fs.pathExists(dir)) && options?.dir) {
      consoleError(`Directory ${dir} already exists!`);
      return;
    }
    await fs.ensureDir(dir);
    //-----------------------------------------------------------------------------

    //Creating api file, if doesn't exist-----------------------------------------
    if (await doesFileExist(apiFile)) {
      consoleError(`File ${apiFile} already exists. Skipping file creation...`);
      return;
    }
    const enumName = `${name?.[0]?.toUpperCase?.() + name?.substring?.(1)}Endpoints`;
    await fs.writeFile(
      apiFile,
      `import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
${
  options?.endpoints
    ? `import {${enumName}} from './${name}.endpoints.ts';
`
    : ""
}
const BASE_URL = '';

export const ${name} = createApi({
  reducerPath: '${name}',
  baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
  endpoints: builder => ({
    // Sample query
    getData: builder.query({
      query: (params) => ({
        url: ${options?.endpoints ? `${enumName}.ALL` : "''"},
        method: 'GET',
        params,
      }),
      transformResponse: (response, meta, _) => ({data: response, meta}),
    }),
  }),
});

export const {useLazyGetDataQuery} = ${name};
`
    );
    consoleCreate(
      path.normalize(`${basePath}${options?.dir ? `/${name}/` : "/"}${name}.ts`)
    );
    //-----------------------------------------------------------------------------

    // Creating endpoints file-----------------------------------------------------
    if (options?.endpoints) {
      const endpointsFile = path.join(dir, `${name}.endpoints.ts`);
      if (await doesFileExist(endpointsFile)) {
        consoleError(
          `File ${endpointsFile} already exists. Skipping file creation...`
        );
        return;
      }
      const enumName = `${name?.[0]?.toUpperCase?.() + name?.substring?.(1)}Endpoints`;
      await fs.writeFile(
        endpointsFile,
        `export enum ${enumName} {
  ALL = '/all',
}
`
      );
      consoleCreate(
        path.normalize(
          `${basePath}${options?.dir ? `/${name}/` : "/"}${name}.endpoints.ts`
        )
      );
    }
    //-----------------------------------------------------------------------------

    // Creating index file---------------------------------------------------------
    if (options?.dir) {
      const indexFile = path.join(dir, "index.ts");
      await fs.writeFile(
        indexFile,
        `export { ${name} } from './${name}.ts';
`
      );
      consoleCreate(path.normalize(basePath + `/${name}/index.ts`));
    }
    //-----------------------------------------------------------------------------

    const prompt = createPromptModule?.();
    console.log("");
    await prompt?.([
      {
        type: "confirm",
        name: "install",
        message: "Do you want to install @reduxjs/toolkit?",
        default: false,
      },
    ])
      .then(async (answers) => {
        if (answers?.install) {
          try {
            console.log("");
            const spinner = ora(`Installing dependency...`).start();
            exec("npm i @reduxjs/toolkit", () => {
              spinner.stop();
              consoleDone();
              if (options?.endpoints) {
                console.log("");
                consoleNote(RTK_QUERY_API_NOTE);
              }
            });
          } catch (error) {
            spinner.stop();
            consoleError("Could not install dependency");
          }
        } else {
          consoleDone();
          if (options?.endpoints) {
            console.log("");
            consoleNote(RTK_QUERY_API_NOTE);
          }
        }
      })
      .catch(() => {});
  }

  async function executeInDryRunMode() {
    consoleCreate(
      path.normalize(`${basePath}${options?.dir ? `/${name}/` : "/"}${name}.ts`)
    );
    if (options?.dir) {
      consoleCreate(path.normalize(basePath + `/${name}/index.ts`));
    }
    if (options?.endpoints) {
      consoleCreate(
        path.normalize(
          `${basePath}${options?.dir ? `/${name}/` : "/"}${name}.endpoints.ts`
        )
      );
    }
    consoleDryRunMessage();
  }
};
