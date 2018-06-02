export interface IRequiredOptions<T> {
    required: true;
    nonProductionDefault?: string;
    parse?: (value: string) => T;
}
export interface IDefaultOptions<T> {
    default: string;
    parse?: (value: string) => T;
}

function env<T = string>(name: string, options: IRequiredOptions<T>): T;
function env<T = string>(name: string, options: IDefaultOptions<T>): T;
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
    const valueOrDefault =
        inputValue || options.default || options.nonProductionDefault;

    // Return the possibly-parsed value
    return options.parse ? options.parse(valueOrDefault) : valueOrDefault;
}
export default env;
