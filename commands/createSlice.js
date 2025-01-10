import fs from "fs-extra";
import path from "path";
import {doesFileExist, consoleDone, consoleCreate, iFileNameValid, consoleDryRunMessage} from "../helpers.js";

export const createslice = async (name, options) => {
  if (!iFileNameValid(name)) {
    consoleError(`Invalid file name: ${name}`);
    return;
  }
  let nameWithoutSlice;
  if (!name.toLowerCase().endsWith("slice")) {
    nameWithoutSlice = name;
  } else {
    nameWithoutSlice = name?.slice?.(0, -5);
  }
  if (!options.keepName) {
    if (!name.toLowerCase().endsWith("slice")) {
      name = name + "Slice";
    }
  }
  let basePath = path.normalize("src/redux/slices");
  if (options?.path) {
    basePath = path.normalize(options?.path);
  }
  const dir = path.join(process.cwd(), basePath);
  const sliceFileName = `${name}.ts`;
  const sliceFile = path.join(dir, sliceFileName);

  if (options?.dryRun) {
    executeInDryRunMode();
  } else {
    executeInNormalMode();
  }
  async function executeInNormalMode() {
    // Creating directory, if doesn't exist
    await fs.ensureDir(dir);

    //-----------------------------------------------------------------------------
    // Creating slice file, if doesn't exist
    if (await doesFileExist(sliceFile)) {
      consoleError(
        `File ${sliceFile} already exists. Skipping file creation...`
      );
      return;
    }
    await fs.writeFile(
      sliceFile,
      `import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {};

const ${name} = createSlice({
name: '${nameWithoutSlice}',
initialState,
reducers: {},
});

export const {} = ${name}.actions;
export default ${name}.reducer;
`
    );
    consoleCreate(path.normalize(`${basePath}/${sliceFileName}`));
    //-----------------------------------------------------------------------------

    consoleDone();
  }
  async function executeInDryRunMode() {
    consoleCreate(path.normalize(`${basePath}/${sliceFileName}`));
    consoleDryRunMessage();
  }
};
