[![npm](https://img.shields.io/npm/v/@mondora/env.svg)](https://www.npmjs.com/package/@mondora/env)
[![Build Status](https://travis-ci.org/mondora/env.svg?branch=master)](https://travis-ci.org/mondora/env)
[![Coverage Status](https://img.shields.io/coveralls/mondora/env.svg)](https://coveralls.io/r/mondora/env?branch=master)
[![Dependencies Status](https://david-dm.org/mondora/env.svg)](https://david-dm.org/mondora/env)
[![Dev Dependencies Status](https://david-dm.org/mondora/env/dev-status.svg)](https://david-dm.org/mondora/env#info=devDependencies)

# env

A better way to retrieve environment variables in nodejs.

Features:

- set defaults for environment variables
- set defaults for environment variables only when `NODE_ENV != production`
- throw an (intelligible) error if a required environment variable is not set
- parse environment variables before returning them (eg, parse a base64 string
  into a Buffer)
- for TypeScript, get the correct type information for the variable:
  - get the correct parsed type when a `parse` function is used
  - if a variable is required, or has a default , its type will be `T`, not
    `T | undefined`

## Install

```sh
yarn add @mondora/env
```

## Usage

```ts
import env from "@mondora/env";

export const REQUIRED = env("REQUIRED", { required: true });
export const REQUIRED_ONLY_IN_PRODUCTION = env("REQUIRED_ONLY_IN_PRODUCTION", {
  required: true,
  nonProductionDefault: "DEFAULT"
});
export const NON_REQUIRED = env("NON_REQUIRED");
export const WITH_DEFAULT = env("WITH_DEFAULT", { default: "DEFAULT" });
// PARSED is a Buffer
export const PARSED = env("TO_BE_PARSE", {
  required: true,
  parse: value => Buffer.from(value)
});
```

### API

### env(name, options)

Retrieves the specified environment variable.

##### Arguments

- `name` **string** _required_: name of the environment variable to retrieve
- `options` **object**:
  - `required` **boolean**: marks the variable as required. Ie, if the variable
    is not set, an error is thrown
  - `nonProductionDefault` **boolean**: makes a required variable only required
    when `NODE_ENV == production`, while giving it a default value otherwise
  - `default` **string**: a default value for the variable if it's not set
  - `parse` **function**: a function to transform the value of the variable (a
    string) into whatever before it's returned by `env`

##### Returns

The value of the environment variable, parsed by the `options.parse` function if
specified.

## Develop

To get started developing the library, clone the project and install
dependencies with [`yarn`](https://yarnpkg.com/). Then you can either:

- `yarn test`: runs tests
- `yarn test --watch`: runs tests, re-runs them on code changes
- `yarn coverage`: runs tests, measures code coverage
- `yarn lint`: runs code linters (prettier + tslint)
- `yarn prettify`: formats code with prettier
- `yarn compile`: compiles the project

> **NOTE**: this project uses [prettier](https://github.com/prettier/prettier)
> to enforce code formatting. Installing the prettier extension for your editor
> of choice is **highly recommended**.

## Release

- Run `npm version x.x.x` to bump a new version of the package. The command will
  set the specified version number in `package.json`, commit the change, tag the
  commit with `vx.x.x`

- Push the commit and the tag to github: `git push --tags origin master`

- If linting and automated tests pass, the module will automatically be
  published to npm

> **Note**: you can use convenience commands `npm version major`,
> `npm version minor`, `npm version patch` to bump the consecutive major / minor
> / patch version of the package.
