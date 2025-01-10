import fs from "fs-extra";
import path from "path";
import {
  doesFileExist,
  consoleDone,
  consoleCreate,
  iFileNameValid,
  consoleDryRunMessage,
  consoleError,
} from "../helpers.js";

export const createHook = async (name, options) => {
  if (!iFileNameValid(name)) {
    consoleError(`Invalid file name: ${name}`);
    return;
  }
  if (!options.keepName) {
    if (!name.toLowerCase().startsWith("use")) {
      name = "use" + name.substring(0, 1).toUpperCase() + name.substring(1);
    }
  }
  let basePath = path.normalize("src/hooks");
  if (options?.path) {
    basePath = path.normalize(options?.path);
  }
  // Do not create a separate folder for the hook if --no-dir option is passed.
  // Instead, add the hook file and the test file to the hooks folder.
  const dir = options?.dir
    ? path.join(process.cwd(), basePath, name)
    : path.join(process.cwd(), basePath);
  const hookFileName = `${name}.ts`;
  const hookFile = path.join(dir, hookFileName);

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

    //Creating hook file, if doesn't exist-----------------------------------------
    if (await doesFileExist(hookFile)) {
      consoleError(
        `File ${hookFile} already exists. Skipping file creation...`
      );
      return;
    }
    await fs.writeFile(
      hookFile,
      `import React, {useState, useEffect} from 'react';

const ${name} = () => {
    return {};
};

export default ${name};
`
    );
    consoleCreate(
      path.normalize(
        `${basePath}${options?.dir ? `/${name}/` : "/"}${hookFileName}`
      )
    );
    //-----------------------------------------------------------------------------

    //Creating test file, if doesn't exist-----------------------------------------
    if (options?.test) {
      const testFile = path.join(dir, `${name}.test.ts`);
      if (await doesFileExist(testFile)) {
        consoleError(
          `File ${testFile} already exists. Skipping file creation...`
        );
        return;
      }
      await fs.writeFile(
        testFile,
        `import {describe} from '@jest/globals';

import ${name} from './${name}';

describe('${name}', () => {});
`
      );
      consoleCreate(
        path.normalize(
          `${basePath}${options?.dir ? `/${name}/` : "/"}${name}.test.ts`
        )
      );
    }
    //-----------------------------------------------------------------------------

    // Creating index file---------------------------------------------------------
    if (options?.dir) {
      const indexFile = path.join(dir, "index.ts");
      await fs.writeFile(
        indexFile,
        `export { default } from './${name}.ts';
`
      );
      consoleCreate(path.normalize(basePath + `/${name}/index.ts`));
    }
    //-----------------------------------------------------------------------------

    consoleDone();
  }
  async function executeInDryRunMode() {
    consoleCreate(
      path.normalize(
        `${basePath}${options?.dir ? `/${name}/` : "/"}${hookFileName}`
      )
    );
    if (options?.test) {
      consoleCreate(
        path.normalize(
          `${basePath}${options?.dir ? `/${name}/` : "/"}${name}.test.ts`
        )
      );
    }
    if (options?.dir) {
      consoleCreate(path.normalize(basePath + `/${name}/index.ts`));
    }
    consoleDryRunMessage();
  }
};
