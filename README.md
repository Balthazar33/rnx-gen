# rnx-gen

## Opinionated resources generator for React Native

![create screen example](https://github.com/Balthazar33/rnx-gen/blob/main/assets/rnx-gen-example-screen.png?raw=true)

<a href="https://www.npmjs.com/package/rnx-gen"><img src="https://img.shields.io/npm/v/rnx-gen.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/rnx-gen"><img src="https://img.shields.io/npm/l/rnx-gen.svg" alt="Package License" /></a>

### Installation

```bash
npm i rnx-gen --save-dev
```

## Usage

### 1. Generate files for a new screen with boilerplate code for each file

```bash
npx rnx-gen g screen UserProfile
```

#### Result:

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

#### Command options:

| Option      | Descriptions                                                     |
| ----------- | ---------------------------------------------------------------- |
| --no-test   | Do not create the tests folder and the test file                 |
| --no-const  | Do not create the constants file                                 |
| --no-style  | Do not create the styles file                                    |
| --path      | Custom path beginning with src (example --path=src/screens/auth) |
| --keep-name | Use the resource name provided without modification              |
| --dry-run   | Simulate command execution without creating any files            |

### 2. Generate files for a new component with boilerplate code for each file

```bash
npx rnx-gen g component AlertModal
```

#### Result:

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

#### Command options:

| Option      | Descriptions                                                         |
| ----------- | -------------------------------------------------------------------- |
| --no-test   | Do not create the tests folder and the test file                     |
| --no-dir    | Do not create a separate folder for the component                    |
| --no-style  | Do not create the styles file                                        |
| --path      | Custom path beginning with src (example --path=src/components/cards) |
| --keep-name | Use the resource name provided without modification                  |
| --dry-run   | Simulate command execution without creating any files                |

### 3. Generate a new hook file with boilerplate code

```bash
npx rnx-gen g hook profileData
```

#### Result:

```bash
src
   |-hooks
        |-useProfileData
            |-useProfileData.ts
            |-useProfileData.test.ts
            |-index.ts
```

#### Command options:

| Option      | Descriptions                                                   |
| ----------- | -------------------------------------------------------------- |
| --no-test   | Do not create the test file                                    |
| --no-dir    | Do not create a separate folder for the hook                   |
| --path      | Custom path beginning with src (example --path=src/hooks/data) |
| --keep-name | Use the resource name provided without modification            |
| --dry-run   | Simulate command execution without creating any files          |

### 4. Generate a new Redux slice with boilerplate code

```bash
npx rnx-gen g slice users
```

#### Result:

```bash
src
   |-redux
        |-slices
            |-usersSlice.ts
```

#### Command options:

| Option      | Descriptions                                                       |
| ----------- | ------------------------------------------------------------------ |
| --path      | Custom path beginning with src (example --path=src/redux/reducers) |
| --keep-name | Use the resource name provided without modification                |
| --dry-run   | Simulate command execution without creating any files              |

### 5. Generate a new api with boilerplate code

```bash
npx rnx-gen g api dashboard
```

#### Result:

```bash
src
   |-services
        |-api
            |-dashboardApi
                |-dashboardApi.ts
                |-dashboardApi.endpoints.ts
                |-index.ts
```

#### Command options:

| Option         | Descriptions                                                 |
| -------------- | ------------------------------------------------------------ |
| --path         | Custom path beginning with src (example --path=src/api/home) |
| --keep-name    | Use the resource name provided without modification          |
| --no-endpoints | Do not create the endpoints file                             |
| --no-dir       | Do not create a separate folder for the api                  |
| --dry-run      | Simulate command execution without creating any files        |

### 6. Set up Redux files (Redux toolkit) with boilerplate code for each file

```bash
npx rnx-gen redux
```

#### Result:

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

#### Command options:

| Option    | Descriptions                                          |
| --------- | ----------------------------------------------------- |
| --dry-run | Simulate command execution without creating any files |

## Dry run

#### Execute any command with the --dry-run option to simulate file creation

#### Example:

```bash
npx rnx-gen g screen Splash --dry-run
```

![dry run example](https://github.com/Balthazar33/rnx-gen/blob/main/assets/dry-run-ss.png?raw=true)
