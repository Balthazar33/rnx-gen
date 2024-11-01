const fs = require("fs-extra");
const path = require("path");
const { doesFileExist, consoleDone, consoleCreate } = require("../helpers");

const createHook = async (name, options) => {
  if (!name.toLowerCase().startsWith("use")) {
    name = "use" + name.substring(0, 1).toUpperCase() + name.substring(1);
  }
  const basePath = "src/hooks";
  // Do not create a separate folder for the hook if --no-dir option is passed.
  // Instead, add the hook file and the test file to the hooks folder.
  const dir = options?.dir
    ? path.join(process.cwd(), basePath, name)
    : path.join(process.cwd(), basePath);
  const hookFileName = `${name}.ts`;
  const hookFile = path.join(dir, hookFileName);

  // Creating directory, if doesn't exist
  if ((await fs.pathExists(dir)) && options?.dir) {
    console.log(`Directory ${dir} already exists!`);
    return;
  }
  await fs.ensureDir(dir);

  //-----------------------------------------------------------------------------
  // Creating hook file, if doesn't exist
  if (await doesFileExist(hookFile)) {
    console.log(`File ${hookFile} already exists. Skipping file creation...`);
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
  consoleCreate(`${basePath}/${hookFileName}`);
  //-----------------------------------------------------------------------------

  //-----------------------------------------------------------------------------
  if (options?.test) {
    // Creating test file, if doesn't exist
    const testFile = path.join(dir, `${name}.test.ts`);
    if (await doesFileExist(testFile)) {
      console.log(`File ${testFile} already exists. Skipping file creation...`);
      return;
    }
    await fs.writeFile(testFile, "");
    consoleCreate(`${basePath}/${name}.test.ts`);
  }
  //-----------------------------------------------------------------------------

  consoleDone();
};

module.exports = { createHook };
