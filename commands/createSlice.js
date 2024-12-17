const fs = require("fs-extra");
const path = require("path");
const {
  doesFileExist,
  consoleDone,
  consoleCreate,
  iFileNameValid,
} = require("../helpers");

const createslice = async (name, options) => {
  if (!iFileNameValid(name)) {
    consoleError(`Invalid file name: ${name}`);
    return;
  }
  if (options?.path && !options?.path?.startsWith("src")) {
    consoleError("Path must begin with 'src'");
    return;
  }
  let nameWithoutSlice;
  if (!name.toLowerCase().endsWith("slice")) {
    nameWithoutSlice = name;
  } else {
    nameWithoutSlice = name?.slice?.(0, -5);
  }
  if(!options.keepName) {
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
