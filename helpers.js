const fs = require("fs").promises;
const chalk = require("chalk");

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
  console.log(chalk.green("DONE!"));
};

const consoleCreate = (filename) => {
  console.log(chalk.blueBright(`CREATED: ${filename}`));
};

const consoleError = (message) => {
  console.log(chalk.redBright("ERROR"));
  console.log(message);
};

module.exports = {
  doesFileExist,
  consoleDone,
  consoleCreate,
  iFileNameValid,
  consoleError,
};
