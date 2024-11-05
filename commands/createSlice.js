const fs = require("fs-extra");
const path = require("path");
const {
  doesFileExist,
  consoleDone,
  consoleCreate,
  iFileNameValid,
} = require("../helpers");

const createslice = async (name) => {
  if (!iFileNameValid(name)) {
    consoleError(`Invalid file name: ${name}`);
    return;
  }
  let nameWithoutSlice;
  if (!name.toLowerCase().endsWith("slice")) {
    nameWithoutSlice = name;
    name = name + "Slice";
  } else {
    nameWithoutSlice = name?.slice?.(0, -5);
  }
  const basePath = "src/redux/slices";
  const dir = path.join(process.cwd(), basePath);
  const sliceFileName = `${name}.ts`;
  const sliceFile = path.join(dir, sliceFileName);

  // Creating directory, if doesn't exist
  await fs.ensureDir(dir);

  //-----------------------------------------------------------------------------
  // Creating slice file, if doesn't exist
  if (await doesFileExist(sliceFile)) {
    console.log(`File ${sliceFile} already exists. Skipping file creation...`);
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
};

module.exports = { createslice };
