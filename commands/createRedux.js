import fs from "fs-extra";
import parser from "@babel/parser";
import path from "path";
import { createPromptModule } from "inquirer";
import { exec } from "child_process";
import ora from "ora";
import generate from "@babel/generator";
import babelTypes from "@babel/types";
import prettier from "prettier";

import {
  doesFileExist,
  consoleDone,
  consoleCreate,
  consoleError,
  consoleDryRunMessage,
  consoleUpdate,
} from "../helpers.js";

export const createRedux = async (options) => {
  let basePath = "src/redux";
  if (options?.path) {
    basePath = path.normalize(options?.path);
  }
  const dir = path.join(process.cwd(), basePath);
  const reducersFile = path.join(dir, "rootReducer.ts");
  const storeFile = path.join(dir, "store.ts");
  const storeUtilsFile = path.join(dir, "store.utils.ts");
  const slicesDirectory = path.join(dir, "slices");
  const selectorsDirectory = path.join(dir, "selectors");
  const selectorFile = path.join(selectorsDirectory, "appSelector.ts");
  const slicesFile = path.join(slicesDirectory, "appSlice.ts");

  if (options?.dryRun) {
    executeInDryRunMode();
  } else {
    executeInNormalMode();
  }
  async function executeInNormalMode() {
    // Creating redux directory, if doesn't exist----------------------------------
    if (await fs.pathExists(dir)) {
      consoleError(`Directory ${dir} already exists!`);
      return;
    }
    await fs.ensureDir(dir);
    //-----------------------------------------------------------------------------

    //-Creating reducers file, if doesn't exist------------------------------------
    if (await doesFileExist(reducersFile)) {
      consoleError(
        `File ${reducersFile} already exists. Skipping file creation...`
      );
      return;
    }
    await fs.writeFile(
      reducersFile,
      `import {combineReducers} from '@reduxjs/toolkit';
import appSlice from './slices/appSlice';

const rootReducer = combineReducers({
  app: appSlice,
});

export default rootReducer;
`
    );
    consoleCreate(path.normalize(`${basePath}/rootReducer.ts`));
    //-----------------------------------------------------------------------------

    //Creating slices directory & file, if doesn't exist---------------------------
    await fs.ensureDir(slicesDirectory);
    if (await doesFileExist(slicesFile)) {
      consoleError(
        `File ${slicesFile} already exists. Skipping file creation...`
      );
      return;
    }
    await fs.writeFile(
      slicesFile,
      `import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, {payload}: PayloadAction<boolean>) => {
      state.loading = payload;
    },
  },
});

export const {setLoading} = appSlice.actions;
export default appSlice.reducer;
`
    );
    consoleCreate(path.normalize(`${basePath}/slices/appSlice.ts`));
    //-----------------------------------------------------------------------------

    //Creating store file, if doesn't exist----------------------------------------
    if (await doesFileExist(storeFile)) {
      consoleError(
        `File ${storeFile} already exists. Skipping file creation...`
      );
      return;
    }
    await fs.writeFile(
      storeFile,
      `import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const configureAppStore = (preloadedState?: any) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    preloadedState,
  });
  return store;
};

export default configureAppStore;
`
    );
    consoleCreate(path.normalize(`${basePath}/store.ts`));
    //-----------------------------------------------------------------------------

    //Creating store.utils file, if doesn't exist----------------------------------
    if (await doesFileExist(storeUtilsFile)) {
      consoleError(
        `File ${storeUtilsFile} already exists. Skipping file creation...`
      );
      return;
    }
    await fs.writeFile(
      storeUtilsFile,
      `import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';
import configureAppStore from './store';
import {AnyAction, ThunkDispatch} from '@reduxjs/toolkit';

export const store = configureAppStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof configureAppStore>;
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`
    );
    consoleCreate(path.normalize(`${basePath}/store.utils.ts`));
    //-----------------------------------------------------------------------------

    //Creating selectors directory, if doesn't exist-------------------------------
    if (!(await fs.pathExists(selectorsDirectory))) {
      await fs.ensureDir(selectorsDirectory);
    }
    //-----------------------------------------------------------------------------

    //Creating appSelector.ts file, if doesn't exist-------------------------------
    if (await doesFileExist(selectorFile)) {
      consoleError(
        `File ${selectorFile} already exists. Skipping file creation...`
      );
      return;
    }
    await fs.writeFile(
      selectorFile,
      `import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store.utils';

export const selectLoading = createSelector((state: RootState) => state.app.loading);
`
    );
    consoleCreate(path.normalize(`${basePath}/selectors/appSelector.ts`));
    //-----------------------------------------------------------------------------

    const wrapWithProvider = async () => {
      // Wrapping the app with Provider--------------------------------------------
      try {
        const filePath = path.join(process.cwd(), "App.tsx");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const ast = parser.parse(fileContent, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
        });
        function wrapReturnInProvider(ast) {
          let hasReturnStatement = false;
          const traverse = (node) => {
            if (node.type === "ReturnStatement") {
              hasReturnStatement = true;
              const returnExpression = node.argument;
              if (
                returnExpression &&
                (returnExpression.type === "JSXElement" ||
                  returnExpression.type === "JSXFragment")
              ) {
                node.argument = {
                  type: "JSXElement",
                  openingElement: {
                    type: "JSXOpeningElement",
                    name: {
                      type: "JSXIdentifier",
                      name: "Provider",
                    },
                    attributes: [
                      {
                        type: "JSXAttribute",
                        name: {
                          type: "JSXIdentifier",
                          name: "store",
                        },
                        value: {
                          type: "JSXExpressionContainer",
                          expression: {
                            type: "Identifier",
                            name: "store",
                          },
                        },
                      },
                    ],
                    selfClosing: false,
                  },
                  closingElement: {
                    type: "JSXClosingElement",
                    name: {
                      type: "JSXIdentifier",
                      name: "Provider",
                    },
                  },
                  children: [returnExpression],
                };
              }
            }
            if (
              node.type === "FunctionDeclaration" ||
              node.type === "ArrowFunctionExpression" ||
              node.type === "FunctionExpression"
            ) {
              if (node.body && node.body.body) {
                node.body.body.forEach(traverse);
              }
            } else if (node.type === "BlockStatement") {
              node.body.forEach(traverse);
            } else if (node.type === "JSXElement") {
              node.children.forEach(traverse);
            }
          };
          ast.program.body.forEach(traverse);
          if (!hasReturnStatement) {
            throw new Error("No return statement found in App.tsx");
          }
          return ast;
        }
        const importProviderAst = babelTypes.importDeclaration(
          [
            babelTypes.importSpecifier(
              babelTypes.identifier("Provider"),
              babelTypes.identifier("Provider")
            ),
          ],
          babelTypes.stringLiteral(`react-redux`)
        );
        const storeProviderAst = babelTypes.importDeclaration(
          [
            babelTypes.importSpecifier(
              babelTypes.identifier("store"),
              babelTypes.identifier("store")
            ),
          ],
          babelTypes.stringLiteral(
            options?.path
              ? `./${basePath}/store.utils`
              : `./src/redux/store.utils`
          )
        );
        ast.program.body.unshift(storeProviderAst);
        ast.program.body.unshift(importProviderAst);
        const modifiedAst = wrapReturnInProvider(ast);
        const { code } = generate.default(modifiedAst, {
          compact: false,
          retainLines: true,
          jsescOption: { minimal: true },
        });
        const formattedCode = await prettier.format(code, {
          semi: true,
          singleQuote: true,
          trailingComma: "all",
          bracketSpacing: true,
          jsxBracketSameLine: false,
          arrowParens: "always",
          tabWidth: 2,
          importOrderSeparation: true,
          parser: "babel-ts",
        });
        fs.writeFileSync(filePath, formattedCode, "utf-8");
        console.log("");
        consoleUpdate("App.tsx");
      } catch (error) {
        consoleError("Could not update App.tsx");
      }
      //---------------------------------------------------------------------------
    };

    const prompt = createPromptModule?.();
    console.log("");
    await prompt?.([
      {
        type: "confirm",
        name: "wrap",
        message: "Do you want to wrap the app with the Provider component?",
        default: false,
      },
      {
        type: "confirm",
        name: "install",
        message: "Do you want to install @reduxjs/toolkit and react-redux?",
        default: false,
      },
    ])
      .then(async (answers) => {
        if (answers?.wrap) {
          await wrapWithProvider();
        }
        if (answers.install) {
          try {
            console.log("");
            const spinner = ora(`Installing dependencies...`).start();
            exec("npm i @reduxjs/toolkit react-redux", () => {
              spinner.stop();
              consoleDone();
            });
          } catch (error) {
            spinner.stop();
            consoleError("Could not install dependencies");
          }
        } else {
          consoleDone();
        }
      })
      .catch(() => {});
  }

  async function executeInDryRunMode() {
    consoleCreate(path.normalize(`${basePath}/rootReducer.ts`));
    consoleCreate(path.normalize(`${basePath}/slices/appSlice.ts`));
    consoleCreate(path.normalize(`${basePath}/store.ts`));
    consoleCreate(path.normalize(`${basePath}/store.utils.ts`));
    consoleCreate(path.normalize(`${basePath}/selectors/appSelector.ts`));
    consoleDryRunMessage();
  }
};
