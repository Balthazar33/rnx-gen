# rn-gen

## Opinionated resources generator for React Native

### Installation

```bash
npm i rn-gen --save-dev
```

## Usage

### Generate files for a new screen with boilerplate code for each file

```bash
rn-gen generate (OR just g) screen UserProfile
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

| Option     | Descriptions                                     |
| ---------- | ------------------------------------------------ |
| --no-test  | Do not create the tests folder and the test file |
| --no-const | Do not create the constants file                 |
| --no-style | Do not create the styles file                    |

### Generate files for a new component with boilerplate code for each file

```bash
rn-gen generate (OR just g) component AlertModal
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

| Option     | Descriptions                                      |
| ---------- | ------------------------------------------------- |
| --no-test  | Do not create the tests folder and the test file  |
| --no-dir   | Do not create a separate folder for the component |
| --no-style | Do not create the styles file                     |

### Generate a new hook file with boilerplate code

```bash
rn-gen generate (OR just g) hook profileData
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

| Option    | Descriptions                                 |
| --------- | -------------------------------------------- |
| --no-test | Do not create the test file                  |
| --no-dir  | Do not create a separate folder for the hook |

### Generate a new redux slice with boilerplate code

```bash
rn-gen generate (OR just g) slice users
```

#### Result:

```bash
src
   |-redux
        |-slices
            |-usersSlice.ts
```

### Set up redux files (redux toolkit) with boilerplate code

```bash
rn-gen redux
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
