import { promises as fs, readFileSync } from "fs";
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
{rgb(255, 225, 0) Command executed with dry-run enabled; no files were created}`
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

const consoleNote = (message) => {
  console.log(chalk`{rgb(255, 225, 0) Note:} ${message}`);
};

function getReactNativeVersion() {
  try {
    const packageJson = JSON.parse(readFileSync("package.json", "utf-8"));
    return packageJson.dependencies["react-native"] || packageJson.devDependencies["react-native"];
  } catch {
    return null;
  }
}

function getReactVersion() {
  try {
    const packageJson = JSON.parse(readFileSync("package.json", "utf-8"));
    return packageJson.dependencies["react"] || packageJson.devDependencies["react"];
  } catch {
    return null;
  }
}

export {
  doesFileExist,
  consoleDone,
  consoleCreate,
  iFileNameValid,
  consoleError,
  consoleDryRunMessage,
  consoleUpdate,
  consoleNote,
  getReactNativeVersion,
  getReactVersion,
};
