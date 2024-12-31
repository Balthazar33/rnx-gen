const resourceTypes = {
  SCREEN: "screen",
  HOOK: "hook",
  COMPONENT: "component",
  SLICE: "slice",
  REDUX: "redux",
};

const commands = {
  CREATE: {
    description:
      "Generate a new resource (type: screen, hook, component, redux slice) with the given name",
    command: "generate <type> <name>",
    alias: "g",
    options: {
      NO_TEST: "--no-test",
      /**
       * Create files without creating a folder
       */
      NO_DIR: "--no-dir",
      NO_CONST: "--no-const",
      NO_STYLE: "--no-style",
      /**
       * Custom path for the file(s)
       */
      PATH: "--path <path>",
      /**
       * Use the name passed by the user as
       */
      KEEP_NAME: "--keep-name",
      /**
       * Execute commands in dry run mode without generating/modifying any files
       */
      DRY_RUN: "--dry-run",
    },
  },
  CREATE_REDUX: {
    description:
      "Set up boilerplate code for redux toolkit (rootReducer, slices, store, and utilities)",
    command: "redux",
    options: {
      /**
       * Execute commands in dry run mode without generating/modifying any files
       */
      DRY_RUN: "--dry-run",
    },
  },
};

const CLI_NAME = "rnx-gen";
const CLI_VERSION = "1.1.6";
const CLI_DESCRIPTION = "Opinionated resources generator for React Native";

export { resourceTypes, commands, CLI_NAME, CLI_VERSION, CLI_DESCRIPTION };
