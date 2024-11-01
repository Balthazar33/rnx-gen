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

const consoleDone = () => {
  console.log(chalk.green("DONE!"));
};

const consoleCreate = (filename) => {
  console.log(chalk.blueBright(`CREATED: ${filename}`));
};

module.exports = { doesFileExist, consoleDone, consoleCreate };
