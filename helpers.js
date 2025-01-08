import { promises as fs } from "fs";
import chalk from "chalk";

const doesFileExist = async (filePath) => {
  try {
    await fs.access(filePath);
    return true; // Exists
  } catch (error) {
    return false; // Doesn't exist
  }
};

const iFileNameValid = (string) => {
  return /^[A-Za-z][A-Za-z0-9-]*$/.test(string);
};

const consoleDone = () => {
  console.log(chalk`
{rgb(0, 255, 251) Done!}`);
};

const consoleDryRunMessage = () => {
  console.log(
    chalk`
{rgb(255, 225, 0) Command executed with dry-run enabled; no files have been created}`
  );
};

const consoleCreate = (filename) => {
  console.log(chalk`{rgb(0, 255, 179) Create:} ${filename}`);
};

const consoleUpdate = (filename) => {
  console.log(chalk`{rgb(0, 166, 255) Update:} ${filename}`);
};

const consoleError = (message) => {
  console.log(chalk`{rgb(255, 55, 0) Error:} ${message}`);
};

export {
  doesFileExist,
  consoleDone,
  consoleCreate,
  iFileNameValid,
  consoleError,
  consoleDryRunMessage,
  consoleUpdate,
};
