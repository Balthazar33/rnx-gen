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
       * Execute the command in dry run mode without generating/modifying any files
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
       * Execute the command in dry run mode without generating/modifying any files
       */
      DRY_RUN: "--dry-run",
      /**
       * Do not create the test.utils.tsx file for the redux store
       */
      NO_TEST_UTIL: "--no-testutil",
    },
  },
  CREATE_ENV: {
    description: "Configure multiple environments (dev, staging, etc.)",
    command: "env",
    options: {
      /**
       * Execute the command in dry run mode without generating/modifying any files
       */
      DRY_RUN: "--dry-run",
    },
  },
};

// Determine which env file is associated with the specified build mode
const envFileMappings = {
  production: `    productiondebug: ".env.production",
    productionrelease: ".env.production",`,
  staging: `
    stagingrelease: ".env.staging",
    stagingdebug: ".env.staging",`,
  development: `
    developmentrelease: ".env.development",
    developmentdebug: ".env.development",`,
  qa: `
    qarelease: ".env.qa",
    qadebug: ".env.qa",`,
  uat: `
    uatrelease: ".env.uat",
    uatdebug: ".env.uat",`,
};

// Environment-specific build script mappings
const buildScriptMappings = {
  production: {
    key: "android:prod",
    value:
      "cd android && gradlew clean && cd .. && npx react-native run-android --mode productionDebug",
  },
  development: {
    key: "android:dev",
    value:
      "cd android && gradlew clean && cd .. && npx react-native run-android --mode developmentDebug --appIdSuffix development",
  },
  staging: {
    key: "android:stage",
    value:
      "cd android && gradlew clean && cd .. && npx react-native run-android --mode stagingDebug --appIdSuffix staging",
  },
  qa: {
    key: "android:qa",
    value:
      "cd android && gradlew clean && cd .. && npx react-native run-android --mode qaDebug --appIdSuffix qa",
  },
  uat: {
    key: "android:uat",
    value:
      "cd android && gradlew clean && cd .. && npx react-native run-android --mode uatDebug --appIdSuffix uat",
  },
};

// Config for prompt module for multi-environment setup
const envPromptConfig = {
  type: "checkbox",
  name: "selections",
  message: "Select environments (at least 1)",
  choices: [
    {
      name: "Production (default)",
      value: "production",
      checked: true,
      disabled: "required",
    },
    { name: "Development", value: "development" },
    { name: "Staging", value: "staging" },
    { name: "QA", value: "qa" },
    { name: "UAT", value: "uat" },
  ],
  validate: function (answer) {
    if (answer.length + 1 < 2) {
      // +1 as production is selected by default
      return "You must choose at least one other environment.";
    }
    return true;
  },
};

// Function for getting the app name within build.gradle
const appNameGetterExpression = `
def getAppNameFromPackageJson() {
    //  Read and parse package.json file from project root
    def inputFile = new File("$rootDir/../package.json")
    def packageJson = new JsonSlurper().parseText(inputFile.text)
    return packageJson["name"]
}
def appName = getAppNameFromPackageJson()`;

// Dummy content for envTypes file
const envTypesFileContent = `declare module 'react-native-config' {
  export interface NativeConfig {
    DUMMY_API_KEY?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
`;

const CLI_NAME = "rnx-gen";
const CLI_VERSION = "1.3.0";
const CLI_DESCRIPTION = "Opinionated resources generator for React Native";
const RTK_QUERY_API_NOTE =
  "Add the auto-generated Redux slice and the custom middleware to the Redux store. Visit https://redux-toolkit.js.org/rtk-query/overview#configure-the-store to learn more.";

export {
  resourceTypes,
  envFileMappings,
  buildScriptMappings,
  envPromptConfig,
  appNameGetterExpression,
  envTypesFileContent,
  commands,
  CLI_NAME,
  CLI_VERSION,
  CLI_DESCRIPTION,
  RTK_QUERY_API_NOTE,
};
