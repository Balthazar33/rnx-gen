const resourceTypes = {
  SCREEN: "screen",
  HOOK: "hook",
  COMPONENT: "component",
  SLICE: "slice",
  REDUX: "redux",
  API: "api",
};

const commands = {
  CREATE: {
    description:
      "Generate a new resource (type: screen, hook, component, redux slice) with the given name",
    command: "generate <type> <name>",
    alias: "g",
    options: {
      /**
       * Do not create the .test.ts file
       */
      NO_TEST: "--no-test",
      /**
       * Create files without creating a folder
       */
      NO_DIR: "--no-dir",
      /**
       * Do not create the .const.ts file
       */
      NO_CONST: "--no-const",
      /**
       * Do not create the .styles.ts file
       */
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
      /**
       * Do not create the .endpoints.ts file
       */
      NO_ENDPOINT: "--no-endpoints",
    },
  },
  CREATE_REDUX: {
    description:
      "Set up boilerplate code for redux toolkit (rootReducer, slices, store, and utilities)",
    command: "redux",
    options: {
      /**
       * Custom path for the redux folder
       */
      PATH: "--path <path>",
      /**
       * Execute commands in dry run mode without generating/modifying any files
       */
      DRY_RUN: "--dry-run",
      /**
       * Do not create the test.utils.tsx file for the redux store 
       */
      NO_TEST_UTIL: "--no-testutil",
    },
  },
};

const CLI_NAME = "rnx-gen";
const CLI_VERSION = "1.2.4";
const CLI_DESCRIPTION = "Opinionated resources generator for React Native";
const RTK_QUERY_API_NOTE =
  "Add the auto-generated Redux slice and the custom middleware to the Redux store. Visit https://redux-toolkit.js.org/rtk-query/overview#configure-the-store to learn more.";

export {
  resourceTypes,
  commands,
  CLI_NAME,
  CLI_VERSION,
  CLI_DESCRIPTION,
  RTK_QUERY_API_NOTE,
};
