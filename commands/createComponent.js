import fs from "fs-extra";
import path from "path";
import {doesFileExist, consoleDone, consoleCreate, iFileNameValid, consoleDryRunMessage} from "../helpers.js";

export const createComponent = async (name, options) => {
  if (options?.path && !options?.path?.startsWith("src")) {
    consoleError("Path must begin with 'src'");
    return;
  }
  if (!iFileNameValid(name)) {
    consoleError(`Invalid file name: ${name}`);
    return;
  }
  if (!options.keepName) {
    // Capitalize component name
    name = name.substring(0, 1).toUpperCase() + name.substring(1);
  }
  let basePath = path.normalize("src/components");
  if (options?.path) {
    basePath = path.normalize(options?.path);
  }
  /*
   * Do not create a separate folder for the component if --no-dir option is passed.
   * Instead, add the component file and the test file(optionally) to the components folder.
   */
  const dir = options?.dir
    ? path.join(process.cwd(), basePath, name)
    : path.join(process.cwd(), basePath);
  const componentFile = path.join(dir, `${name}.tsx`);

  if (!options?.dryRun) {
    executeInNormalMode();
  } else {
    executeInDryRunMode();
  }

  async function executeInNormalMode() {
    // Creating directory, if doesn't exist----------------------------------------
    if ((await fs.pathExists(dir)) && options?.dir) {
      console.log(`Directory ${dir} already exists!`);
      return;
    }
    await fs.ensureDir(dir);
    //-----------------------------------------------------------------------------
    //Creating component file, if doesn't exist---------------------------------------
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
    <View style={style.container}>
      <Text>${name} component</Text>
    </View>
  );
};
`
    : `const ${name} = () => {
  return (
    <View>
      <Text>${name} component</Text>
    </View>
  );
};
`
}
export default ${name};
`
    );
    consoleCreate(
      path.normalize(
        `${basePath}${options?.dir ? `/${name}/` : "/"}${name}.tsx`
      )
    );
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
  return StyleSheet.create({
    container: {},
  });
};
`
      );
      consoleCreate(
        path.normalize(
          `${basePath}${options?.dir ? `/${name}/` : "/"}${name}.styles.ts`
        )
      );
    }
    //-----------------------------------------------------------------------------

    //Creating test file, if doesn't exist-----------------------------------------
    if (options?.test) {
      const testsDir = path.join(dir, "__tests__");
      await fs.ensureDir(testsDir);
      const testFile = path.join(testsDir, `${name}.test.tsx`);
      if (await doesFileExist(testFile)) {
        console.log(
          `File ${testFile} already exists. Skipping file creation...`
        );
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
        path.normalize(
          `${basePath}${
            options?.dir ? `/${name}/` : "/"
          }__tests__/${name}.test.tsx`
        )
      );
    }
    //-----------------------------------------------------------------------------

    // Creating index file---------------------------------------------------------
    if (options?.dir) {
      const indexFile = path.join(dir, "index.ts");
      await fs.writeFile(
        indexFile,
        `export { default } from './${name}.tsx';
`
      );
      consoleCreate(path.normalize(basePath + `/${name}/index.ts`));
    }
    //-----------------------------------------------------------------------------

    consoleDone();
  }
  function executeInDryRunMode() {
    const commonPath = `${basePath}${options?.dir ? `/${name}/` : "/"}`;
    consoleCreate(path.normalize(`${commonPath}${name}.tsx`));
    if (options?.style) {
      consoleCreate(path.normalize(`${commonPath}${name}.styles.ts`));
    }
    if (options?.test) {
      consoleCreate(path.normalize(`${commonPath}__tests__/${name}.test.tsx`));
    }
    if (options?.dir) {
      consoleCreate(path.normalize(basePath + `/${name}/index.ts`));
    }
    consoleDryRunMessage();
  }
};
