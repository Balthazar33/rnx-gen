const fs = require("fs-extra");
const path = require("path");
const { doesFileExist, consoleDone, consoleCreate } = require("../helpers");

const createScreen = async (name, options) => {
  if (!name.toLowerCase().endsWith("screen")) {
    name = name + "Screen";
  }
  name = name.substring(0, 1).toUpperCase() + name.substring(1);
  const basePath = "src/screens";
  const dir = path.join(process.cwd(), basePath, name);
  const componentFile = path.join(dir, `${name}.tsx`);
  const typesFile = path.join(dir, `${name}.types.ts`);
  const indexFile = path.join(dir, "index.ts");

  // Creating directory, if doesn't exist
  if (await fs.pathExists(dir)) {
    console.log(`Directory ${dir} already exists!`);
    return;
  }
  await fs.ensureDir(dir);

  // Creating UI file, if doesn't exist
  //-----------------------------------------------------------------------------
  if (await doesFileExist(componentFile)) {
    console.log(
      `File ${componentFile} already exists. Skipping file creation...`
    );
    return;
  }
  await fs.writeFile(
    componentFile,
    `import React from 'react';
import { View, Text } from 'react-native';

const ${name} = () => {
  return (
    <View>
      <Text>${name} Screen</Text>
    </View>
  );
};

export default ${name};

`
  );
  consoleCreate(`${basePath}/${name}.tsx`);
  //-----------------------------------------------------------------------------

  //-----------------------------------------------------------------------------
  // Creating types file, if doesn't exist
  if (await doesFileExist(typesFile)) {
    console.log(`File ${typesFile} already exists. Skipping file creation...`);
    return;
  }
  await fs.writeFile(
    typesFile,
    `export interface ${name}Props {}
`
  );
  consoleCreate(`${basePath}/${name}.types.ts`);
  //-----------------------------------------------------------------------------

  //-----------------------------------------------------------------------------
  if (options.test) {
    // Creating test file, if doesn't exist
    const testsDir = path.join(dir, "__tests__");
    await fs.ensureDir(testsDir);
    const testFile = path.join(testsDir, `${name}.test.tsx`);
    if (await doesFileExist(testFile)) {
      console.log(`File ${testFile} already exists. Skipping file creation...`);
      return;
    }
    await fs.writeFile(testFile, "");
    consoleCreate(`${basePath}/${name}.test.tsx`);
  }
  //-----------------------------------------------------------------------------

  //-----------------------------------------------------------------------------
  if (options.const) {
    // Creating constants file, if doesn't exist
    const constantsFile = path.join(dir, `${name}.constants.ts`);
    if (await doesFileExist(constantsFile)) {
      console.log(
        `File ${constantsFile} already exists. Skipping file creation...`
      );
      return;
    }
    await fs.writeFile(constantsFile, "");
    consoleCreate(`${basePath}/${name}.constants.ts`);
  }
  //-----------------------------------------------------------------------------

  // Creating index file
  await fs.writeFile(indexFile, `export { default } from './${name}.tsx';`);
  consoleCreate(basePath + "/index.ts");

  consoleDone();
};

module.exports = { createScreen };
