#!/usr/bin/env node

const { Command } = require("commander");
const { createScreen } = require("./commands/createScreen");
const { createHook } = require("./commands/createHook");
const {
  resourceTypes,
  CLI_NAME,
  CLI_VERSION,
  CLI_DESCRIPTION,
  commands,
} = require("./constants");
const { createComponent } = require("./commands/createComponent");
const { consoleError } = require("./helpers");
const { createslice } = require("./commands/createSlice");

const program = new Command();

program.name(CLI_NAME).description(CLI_DESCRIPTION).version(CLI_VERSION);

program
  .command(commands.CREATE.command)
  .alias(commands.CREATE.alias)
  .description(commands.CREATE.description)
  .option(commands.CREATE.options.NO_CONST, "do not create a constants file")
  .option(commands.CREATE.options.NO_TEST, "do not create a test file")
  .option(
    commands.CREATE.options.NO_DIR,
    "do not create a separate folder for the files"
  )
  .action((type, name, options) => {
    if (type === resourceTypes.SCREEN) {
      createScreen(name, options);
    } else if (type === resourceTypes.HOOK) {
      createHook(name, options);
    } else if (type === resourceTypes.COMPONENT) {
      createComponent(name, options);
    } else if (type === resourceTypes.SLICE) {
      createslice(name);
    } else {
      consoleError(`Unsupported resource type: ${type}`);
    }
  });

program.exitOverride();
program.on("command:*", () => {
  console.error("invalid command:", program.args.join(" "));
  console.log("See --help for available commands.");
  process.exit(1);
});

try {
  program.parse(process.argv);
} catch (error) {}
