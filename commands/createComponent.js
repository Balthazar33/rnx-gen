const fs = require("fs-extra");
const path = require("path");
const { doesFileExist, consoleDone, consoleCreate } = require("../helpers");

const createComponent = async (name, options) => {
  name = name.substring(0, 1).toUpperCase() + name.substring(1);
  const basePath = "src/components";
  /**
   * Do not create a separate folder for the component if --no-dir option is passed.
   * Instead, add the component file and the test file(optionally) to the components folder.
   */
  const dir = options?.dir
    ? path.join(process.cwd(), basePath, name)
    : path.join(process.cwd(), basePath);
  const componentFile = path.join(dir, `${name}.tsx`);

  // Creating directory, if doesn't exist
  if ((await fs.pathExists(dir)) && options?.dir) {
    console.log(`Directory ${dir} already exists!`);
    return;
  }
  await fs.ensureDir(dir);

  //-----------------------------------------------------------------------------
  // Creating component file, if doesn't exist
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
      <Text>${name} component</Text>
    </View>
  );
};

export default ${name};
`
  );
  consoleCreate(`${basePath}/${name}.tsx`);
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
    consoleCreate(`${basePath}/${name}.test.tsx`);
  }
  //-----------------------------------------------------------------------------

  consoleDone();
};

module.exports = { createComponent };
