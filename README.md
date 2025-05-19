<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Balthazar33/rnx-gen/blob/main/assets/rnx-gen-dark.png">
    <img src="https://github.com/Balthazar33/rnx-gen/blob/main/assets/rnx-gen-light.png" width="800px" alt="RnxGen" />
  </picture>
</p>
<p align="center">Opinionated resources generator for React Native</p>
<p align="center">
   <a href="https://www.npmjs.com/package/rnx-gen"><img src="https://img.shields.io/npm/v/rnx-gen.svg" alt="NPM Version" /></a>
   <a href="https://www.npmjs.com/package/rnx-gen"><img src="https://img.shields.io/npm/l/rnx-gen.svg" alt="Package License" /></a>
</p>

---

- [The problem](#the-problem)
- [The solution](#the-solution)
- [Installation](#installation)
- [Usage](#usage)
  - [Screen](#screen)
  - [Component](#component)
  - [Hook](#hook)
  - [Redux Slice](#redux-slice)
  - [Api](#api)
  - [Redux folder](#redux-folder)
  - [Multi-environment setup](#multi-environment-setup)
- [Dry run](#dry-run)

## The problem

When creating a React Native project with the CLI, quite a lot of files need to be created manually. This can include multiple files for a screen component (types, constants, styles), hooks, apis, or the whole redux store. Configuring multi-environment support for a project is no mean feat either, requiring a significant amount of time.

## The solution

Use `rnx-gen` to create common resources with a single command.\
Here's how you would generate the files for a new screen component:

![create screen example](https://github.com/Balthazar33/rnx-gen/blob/main/assets/rnx-gen-example-screen.png?raw=true)

## Installation

Save `rnx-gen` as a dev dependency

```bash
npm i rnx-gen --save-dev
```

or install it globally

```bash
npm i -g rnx-gen
```

## Usage

> Note: Run all the commands at the root of the project

### Screen

```bash
npx rnx-gen g screen UserProfile
```

- Result

```bash
src
   |-screens
        |-UserProfileScreen
            |-__tests__
                |-UserProfileScreen.test.ts
            |-UserProfileScreen.tsx
            |-UserProfileScreen.types.ts
            |-UserProfileScreen.styles.ts
            |-UserProfileScreen.constants.ts
            |-index.ts
```

- Command options

| Option      | Descriptions                                          |
| ----------- | ----------------------------------------------------- |
| --no-test   | Do not create the tests folder and the test file      |
| --no-const  | Do not create the constants file                      |
| --no-style  | Do not create the styles file                         |
| --path      | Custom path (example --path=src/screens/auth)         |
| --keep-name | Use the resource name provided without modification   |
| --dry-run   | Simulate command execution without creating any files |

### Component

```bash
npx rnx-gen g component AlertModal
```

- Result

```bash
src
   |-components
        |-AlertModal
            |-__tests__
                |-AlertModal.test.ts
            |-AlertModal.tsx
            |-AlertModal.styles.ts
            |-index.ts
```

- Command options

| Option      | Descriptions                                          |
| ----------- | ----------------------------------------------------- |
| --no-test   | Do not create the tests folder and the test file      |
| --no-dir    | Do not create a separate folder for the component     |
| --no-style  | Do not create the styles file                         |
| --path      | Custom path (example --path=src/components/cards)     |
| --keep-name | Use the resource name provided without modification   |
| --dry-run   | Simulate command execution without creating any files |

### Hook

```bash
npx rnx-gen g hook profileData
```

- Result

```bash
src
   |-hooks
        |-useProfileData
            |-useProfileData.ts
            |-useProfileData.test.ts
            |-index.ts
```

- Command options

| Option      | Descriptions                                          |
| ----------- | ----------------------------------------------------- |
| --no-test   | Do not create the test file                           |
| --no-dir    | Do not create a separate folder for the hook          |
| --path      | Custom path (example --path=src/hooks/data)           |
| --keep-name | Use the resource name provided without modification   |
| --dry-run   | Simulate command execution without creating any files |

### Redux slice

```bash
npx rnx-gen g slice users
```

- Result

```bash
src
   |-redux
        |-slices
            |-usersSlice.ts
```

- Command options

| Option      | Descriptions                                          |
| ----------- | ----------------------------------------------------- |
| --path      | Custom path (example --path=src/redux/reducers)       |
| --keep-name | Use the resource name provided without modification   |
| --dry-run   | Simulate command execution without creating any files |

### Api

```bash
npx rnx-gen g api dashboard
```

- Result

```bash
src
   |-services
        |-api
            |-dashboardApi
                |-dashboardApi.ts
                |-dashboardApi.endpoints.ts
                |-index.ts
```

- Command options

| Option         | Descriptions                                          |
| -------------- | ----------------------------------------------------- |
| --path         | Custom path (example --path=src/api/home)             |
| --keep-name    | Use the resource name provided without modification   |
| --no-endpoints | Do not create the endpoints file                      |
| --no-dir       | Do not create a separate folder for the api           |
| --dry-run      | Simulate command execution without creating any files |

### Redux folder

```bash
npx rnx-gen redux
```

- Result

```bash
src
   |-redux
        |-slices
            |-appSlice.ts
        |-selectors
            |-appSelectors.ts
        |-rootReducer.ts
        |-store.ts
        |-store.utils.ts
        |-test.utils.tsx
```

- Command options

| Option        | Descriptions                                          |
| ------------- | ----------------------------------------------------- |
| --path        | Custom path for the redux folder                      |
| --no-testutil | Do not create the test.utils.tsx file                 |
| --dry-run     | Simulate command execution without creating any files |

### Multi-environment setup

Configure multiple environments (`android only`)

```bash
npx rnx-gen env
```

- Result

```bash
android
   |-app
        |-build.gradle <-- Modified

package.json <-- Modified

.env.production <-- Created
.env.development <-- Created (and others selected from the options)

envTypes.d.ts <-- Created
```

- Command options

| Option                        | Descriptions                                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| --dry-run                     | Simulate command execution without creating any files                                                       |
| Multi-select for environments | Select one or more environments from Development, Staging, QA, and UAT. (Production is selected by default) |

Accessing env variables
```ts
// In App.tsx (for instance)
import Config from 'react-native-config';

const apiKey = Config.DUMMY_API_KEY;
```
Running environment-specific debug builds:
```bash
npm run android:dev
npm run android:prod
npm run android:stage
npm run android:qa
npm run android:uat
```

## Dry run

#### Execute any command with the `--dry-run` option to simulate file creation

- Example

```bash
npx rnx-gen g screen Splash --dry-run
```

![dry run example](https://github.com/Balthazar33/rnx-gen/blob/main/assets/dry-run-ss.png?raw=true)
