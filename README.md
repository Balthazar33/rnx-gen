# rnx-gen

## Opinionated resources generator for React Native

![create screen example](https://github.com/Balthazar33/rnx-gen/blob/main/rnx-gen-example-screen.png?raw=true)

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

| Option     | Descriptions                                                    |
| ---------- | --------------------------------------------------------------- |
| --no-test  | Do not create the tests folder and the test file                |
| --no-const | Do not create the constants file                                |
| --no-style | Do not create the styles file                                   |
| --path     | Custom path starting from src (example --path=src/screens/auth) |

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
```

#### Command options:

| Option     | Descriptions                                                        |
| ---------- | ------------------------------------------------------------------- |
| --no-test  | Do not create the tests folder and the test file                    |
| --no-dir   | Do not create a separate folder for the component                   |
| --no-style | Do not create the styles file                                       |
| --path     | Custom path starting from src (example --path=src/components/cards) |

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

| Option    | Descriptions                                                  |
| --------- | ------------------------------------------------------------- |
| --no-test | Do not create the test file                                   |
| --no-dir  | Do not create a separate folder for the hook                  |
| --path    | Custom path starting from src (example --path=src/hooks/data) |

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

### 5. Set up Redux files (Redux toolkit) with boilerplate code for each file

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
