## 1.3.0 (June 3, 2018)

Features:

- allow setting a custom input source from which environment variables are
  retrieved (the default input source is `process.env`)

Fixes:

- correctly handle variables whose value is the empty string

## 1.2.0 (June 3, 2018)

Features:

- allow specifying a `parse` function even when the variable is not required and
  doesn't have a default (when the variable is not set, the function is not
  called)

## 1.1.2 (June 2, 2018)

Features:

- `nonProductionDefault` option to set a default value for required variables
  when `NODE_ENV != production`
- runtime checking of options

## 1.1.(0-1) (June 2, 2018 - bad npm publications)

## 1.0.4 (September 6, 2017)

Initial release.

## 1.0.(0-3) (September 6, 2017 - bad npm publication with travis)
