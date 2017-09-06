export interface IRequiredOptions<T> {
    required: true;
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
    const value = process.env[name];
    if (options.required === true && value === undefined) {
        throw new Error(`Required environment variable ${name} is not set`);
    }
    const valueOrDefault = value || options.default;
    return options.parse ? options.parse(valueOrDefault) : valueOrDefault;
}
export default env;
