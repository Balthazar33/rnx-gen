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
      "generate a new resource (type: screen, hook, etc.) with the given name",
    command: "generate <type> <name>",
    alias: "g",
    options: {
      NO_TEST: "--no-test",
      NO_DIR: "--no-dir",
      NO_CONST: "--no-const",
    },
  },
  CREATE_REDUX: {
    description:
      "set up redux files (rootReducer, slices, store, and utilities)",
    command: "redux",
    options: {},
  },
};

const CLI_NAME = "rn-gen";
const CLI_VERSION = "1.0.0";
const CLI_DESCRIPTION =
  "An opinionated tool for generating React Native resources in a jiffy";

module.exports = {
  resourceTypes,
  commands,
  CLI_NAME,
  CLI_VERSION,
  CLI_DESCRIPTION,
};
