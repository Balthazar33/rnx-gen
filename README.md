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
- [Dry run](#dry-run)


## The problem
If you follow the recommended folder structure for React Native apps, you have to create multiple files for a single screen or a component (styles, constants, types etc.). This wastes a lot of time.

## The solution
Use `rnx-gen` to create common resources with a single command.\
Here's how you would generate the files for a new screen component:

![create screen example](https://github.com/Balthazar33/rnx-gen/blob/main/assets/rnx-gen-example-screen.png?raw=true)

## Installation
Save `rnx-gen` as a dev dependency
```bash
npm i rnx-gen --save-dev
```

## Usage

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
```

- Command options

| Option    | Descriptions                                          |
| --------- | ----------------------------------------------------- |
| --path    | Custom path for the redux folder                      |
| --dry-run | Simulate command execution without creating any files |

## Dry run

#### Execute any command with the `--dry-run` option to simulate file creation

- Example

```bash
npx rnx-gen g screen Splash --dry-run
```

![dry run example](https://github.com/Balthazar33/rnx-gen/blob/main/assets/dry-run-ss.png?raw=true)
