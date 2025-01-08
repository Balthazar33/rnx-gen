#!/usr/bin/env node

import {Command} from "commander";
import {createScreen} from "./commands/createScreen.js";
import {createHook} from "./commands/createHook.js";
import {resourceTypes, CLI_NAME, CLI_VERSION, CLI_DESCRIPTION, commands} from "./constants.js";
import {createComponent} from "./commands/createComponent.js";
import {consoleError} from "./helpers.js";
import {createslice} from "./commands/createSlice.js";
import {createRedux} from "./commands/createRedux.js";
import {createApi} from "./commands/createApi.js";

const program = new Command();

program.name(CLI_NAME).description(CLI_DESCRIPTION).version(CLI_VERSION);

program
  .command(commands.CREATE_REDUX.command)
  .description(commands.CREATE_REDUX.description)
  .option(
    commands.CREATE_REDUX.options.DRY_RUN,
    "Execute the command without creating any file"
  )
  .action((options) => {
    try {
      createRedux(options);
    } catch (error) {
      consoleError(
        `An error occurred while executing the script. Please try again.`
      );
    }
  });

program
  .command(commands.CREATE.command)
  .alias(commands.CREATE.alias)
  .description(commands.CREATE.description)
  .option(commands.CREATE.options.NO_CONST, "do not create a constants file")
  .option(commands.CREATE.options.NO_TEST, "do not create a test file")
  .option(commands.CREATE.options.NO_STYLE, "do not create a styles file")
  .option(
    commands.CREATE.options.PATH,
    "custom path for the files, starting from src"
  )
  .option(
    commands.CREATE.options.KEEP_NAME,
    "use the resource name provided without modification"
  )
  .option(
    commands.CREATE.options.NO_DIR,
    "do not create a separate folder for the files"
  )
  .option(
    commands.CREATE.options.DRY_RUN,
    "Execute the command without creating any file"
  )
  .action((type, name, options) => {
    try {
      if (type === resourceTypes.SCREEN) {
        createScreen(name, options);
      } else if (type === resourceTypes.HOOK) {
        createHook(name, options);
      } else if (type === resourceTypes.COMPONENT) {
        createComponent(name, options);
      } else if (type === resourceTypes.SLICE) {
        createslice(name, options);
      } else if (type === resourceTypes.API) {
        createApi(name, options);
      } else {
        consoleError(`Unsupported resource type: ${type}`);
      }
    } catch (error) {
      consoleError(
        `An error occurred while executing the script. Please try again.`
      );
    }
  });

program.exitOverride();
program.on("command:*", () => {
  consoleError("invalid command:", program.args.join(" "));
  console.log("See --help for available commands.");
  process.exit(1);
});

try {
  program.parse(process.argv);
} catch (error) {}
