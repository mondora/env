export interface IBaseOptions<T> {
    parse?: (value: string) => T;
}
export interface IRequiredOptions<T> extends IBaseOptions<T> {
    required: true;
    nonProductionDefault?: string;
}
export interface IDefaultOptions<T> extends IBaseOptions<T> {
    default: string;
}

function env<T = string>(name: string, options: IRequiredOptions<T>): T;
function env<T = string>(name: string, options: IDefaultOptions<T>): T;
function env<T = string>(name: string, options: IBaseOptions<T>): T | undefined;
function env(name: string): string | undefined;
function env(name: string, options: any = {}) {
    // Validate input parameters
    if (options.required !== undefined && options.default !== undefined) {
        throw new TypeError(
            "Options 'default' and 'required' are mutually exclusive"
        );
    }
    if (
        options.default !== undefined &&
        options.nonProductionDefault !== undefined
    ) {
        throw new TypeError(
            "Option 'nonProductionDefault' can only be used with option 'required'"
        );
    }

    // Get the input value from environment variables
    const inputValue = process.env[name];

    // Throw an error when:
    // - the variable is marked as required
    // - AND no value was provided
    // - AND either
    //   - NODE_ENV is set to production
    //   - OR no nonProductionDefault was set
    if (
        options.required === true &&
        inputValue === undefined &&
        (process.env.NODE_ENV === "production" ||
            options.nonProductionDefault === undefined)
    ) {
        throw new Error(`Required environment variable ${name} is not set`);
    }

    // Get the value or one of the defaults
    const valueOrDefaultOrUndefined =
        inputValue || options.default || options.nonProductionDefault;

    // Return the possibly-parsed value
    return options.parse && valueOrDefaultOrUndefined
        ? options.parse(valueOrDefaultOrUndefined)
        : valueOrDefaultOrUndefined;
}
export default env;
