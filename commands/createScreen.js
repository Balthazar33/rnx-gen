const fs = require("fs-extra");
const path = require("path");
const {
  doesFileExist,
  consoleDone,
  consoleCreate,
  iFileNameValid,
  consoleError,
} = require("../helpers");

const createScreen = async (name, options) => {
  if (options?.path && !options?.path?.startsWith("src")) {
    consoleError("Path must begin with 'src'");
    return;
  }
  if (!iFileNameValid(name)) {
    consoleError(`Invalid file name: ${name}`);
    return;
  }
  if (!name.toLowerCase().endsWith("screen")) {
    name = name + "Screen";
  }
  name = name.substring(0, 1).toUpperCase() + name.substring(1);
  let basePath = path.normalize("src/screens");
  if (options?.path) {
    basePath = path.normalize(options?.path);
  }
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

  //Creating UI file, if doesn't exist-------------------------------------------
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

${
  options?.style
    ? `import {useStyles} from './${name}.styles';

const ${name} = () => {
  const style = useStyles();

  return (
    <View style={[style]}>
      <Text>${name} Screen</Text>
    </View>
  );
};`
    : `const ${name} = () => {

  return (
    <View>
      <Text>${name} Screen</Text>
    </View>
  );`
}

export default ${name};
`
  );
  consoleCreate(path.normalize(`${basePath}/${name}.tsx`));
  //-----------------------------------------------------------------------------

  //Creating types file, if doesn't exist----------------------------------------
  if (await doesFileExist(typesFile)) {
    console.log(`File ${typesFile} already exists. Skipping file creation...`);
    return;
  }
  await fs.writeFile(
    typesFile,
    `export interface ${name}Props {}
`
  );
  consoleCreate(path.normalize(`${basePath}/${name}.types.ts`));
  //-----------------------------------------------------------------------------

  //Creating test file, if doesn't exist-----------------------------------------
  if (options.test) {
    const testsDir = path.join(dir, "__tests__");
    await fs.ensureDir(testsDir);
    const testFile = path.join(testsDir, `${name}.test.tsx`);
    if (await doesFileExist(testFile)) {
      console.log(`File ${testFile} already exists. Skipping file creation...`);
      return;
    }
    await fs.writeFile(
      testFile,
      `import React from 'react';

import {it, describe, expect} from '@jest/globals';
import renderer from 'react-test-renderer';

import ${name} from '../${name}';

describe('${name}', () => {
  it('renders correctly', () => {
    const elementTree = renderer.create(<${name} />).toJSON();
    expect(elementTree).toMatchSnapshot();
  });
});
`
    );
    consoleCreate(
      path.normalize(`${basePath}/${name}/__tests__/${name}.test.tsx`)
    );
  }
  //-----------------------------------------------------------------------------

  //Creating styles file, if doesn't exist---------------------------------------
  if (options?.style) {
    const stylesFile = path.join(dir, `${name}.styles.ts`);
    if (await doesFileExist(stylesFile)) {
      console.log(
        `File ${stylesFile} already exists. Skipping file creation...`
      );
      return;
    }
    await fs.writeFile(
      stylesFile,
      `import { StyleSheet } from 'react-native';

export const useStyles = () => {
  return StyleSheet.create({});
};
`
    );
    consoleCreate(path.normalize(`${basePath}/${name}.styles.ts`));
  }
  //-----------------------------------------------------------------------------

  //Creating constants file, if doesn't exist------------------------------------
  if (options.const) {
    const constantsFile = path.join(dir, `${name}.constants.ts`);
    if (await doesFileExist(constantsFile)) {
      console.log(
        `File ${constantsFile} already exists. Skipping file creation...`
      );
      return;
    }
    await fs.writeFile(constantsFile, "");
    consoleCreate(path.normalize(`${basePath}/${name}.constants.ts`));
  }
  //-----------------------------------------------------------------------------

  // Creating index file---------------------------------------------------------
  await fs.writeFile(
    indexFile,
    `export { default } from './${name}.tsx';
`
  );
  consoleCreate(path.normalize(basePath + `/${name}/index.ts`));
  //-----------------------------------------------------------------------------

  consoleDone();
};

module.exports = { createScreen };
