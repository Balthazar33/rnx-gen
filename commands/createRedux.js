const fs = require("fs-extra");
const path = require("path");
const {
  doesFileExist,
  consoleDone,
  consoleCreate,
  consoleError,
  consoleDryRunMessage,
} = require("../helpers");

const createRedux = async (options) => {
  const basePath = "src/redux";
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
      console.log(`Directory ${dir} already exists!`);
      return;
    }
    await fs.ensureDir(dir);
    //-----------------------------------------------------------------------------

    //-Creating reducers file, if doesn't exist------------------------------------
    if (await doesFileExist(reducersFile)) {
      console.log(
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
      console.log(
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
      console.log(
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
      console.log(
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
      console.log(
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

    consoleDone();
  };
  async function executeInDryRunMode() {
    consoleCreate(path.normalize(`${basePath}/rootReducer.ts`));
    consoleCreate(path.normalize(`${basePath}/slices/appSlice.ts`));
    consoleCreate(path.normalize(`${basePath}/store.ts`));
    consoleCreate(path.normalize(`${basePath}/store.utils.ts`));
    consoleCreate(path.normalize(`${basePath}/selectors/appSelector.ts`));
    consoleDryRunMessage();
  };
};

module.exports = { createRedux };
