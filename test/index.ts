import { expect } from "chai";

import env from "../src";

describe("The env function", () => {
    beforeEach(() => {
        process.env = {
            DEFINED: "DEFINED",
            UNDEFINED: undefined,
            // String BASE64 in base64
            BASE64: "QkFTRTY0",
            UNDEFINED_BASE64: undefined
        };
    });

    describe("validates input parameters", () => {
        it("case: throws when both `required` and `default` options are set", () => {
            const troublemaker = () => {
                env("DEFINED", {
                    required: true,
                    default: "DEFAULT"
                } as any);
            };
            expect(troublemaker).to.throw(
                "Options 'default' and 'required' are mutually exclusive"
            );
        });

        it("case: throws when both `default` and `nonProductionDefault` options are set", () => {
            const troublemaker = () => {
                env("DEFINED", {
                    default: "DEFAULT",
                    nonProductionDefault: "NON_PRODUCTION_DEFAULT"
                } as any);
            };
            expect(troublemaker).to.throw(
                "Option 'nonProductionDefault' can only be used with option 'required'"
            );
        });
    });

    describe("returns the value of the environment variable with the specified name", () => {
        it("case: defined variable", () => {
            const value = env("DEFINED");
            expect(value).to.equal("DEFINED");
        });

        it("case: undefined variable", () => {
            const value = env("UNDEFINED");
            expect(value).to.equal(undefined);
        });
    });

    describe("when `required` option is set", () => {
        describe("when the variable is defined, always returns the defined value", () => {
            it("case: NODE_ENV == production and `nonProductionDefault` option set", () => {
                process.env.NODE_ENV = "production";
                const value = env("DEFINED", {
                    required: true,
                    nonProductionDefault: "NON_PRODUCTION_DEFAULT"
                });
                expect(value).to.equal("DEFINED");
            });

            it("case: NODE_ENV == production and no `nonProductionDefault` options set", () => {
                process.env.NODE_ENV = "production";
                const value = env("DEFINED", { required: true });
                expect(value).to.equal("DEFINED");
            });

            it("case: NODE_ENV != production and `nonProductionDefault` option set", () => {
                process.env.NODE_ENV = "test";
                const value = env("DEFINED", {
                    required: true,
                    nonProductionDefault: "NON_PRODUCTION_DEFAULT"
                });
                expect(value).to.equal("DEFINED");
            });

            it("case: NODE_ENV != production and no `nonProductionDefault` option set", () => {
                process.env.NODE_ENV = "test";
                const value = env("DEFINED", { required: true });
                expect(value).to.equal("DEFINED");
            });
        });

        describe("when the variable is not defined", () => {
            it("if NODE_ENV == production, throws", () => {
                process.env.NODE_ENV = "production";
                const troublemaker = () => {
                    env("UNDEFINED", {
                        required: true,
                        nonProductionDefault: "NON_PRODUCTION_DEFAULT"
                    });
                };
                expect(troublemaker).to.throw(
                    "Required environment variable UNDEFINED is not set"
                );
            });

            it("if NODE_ENV != production, and a `nonProductionDefault` option is set, returns the nonProductionDefault", () => {
                process.env.NODE_ENV = "test";
                const value = env("UNDEFINED", {
                    required: true,
                    nonProductionDefault: "NON_PRODUCTION_DEFAULT"
                });
                expect(value).to.equal("NON_PRODUCTION_DEFAULT");
            });

            it("if NODE_ENV != production, and no `nonProductionDefault` option is set, throws", () => {
                process.env.NODE_ENV = "test";
                const troublemaker = () => {
                    env("UNDEFINED", { required: true });
                };
                expect(troublemaker).to.throw(
                    "Required environment variable UNDEFINED is not set"
                );
            });
        });
    });

    describe("when `default` option is set", () => {
        it("if the variable is defined, returns its value", () => {
            const value = env("DEFINED", { default: "DEFAULT" });
            expect(value).to.equal("DEFINED");
        });

        it("if the variable is not defined, returns the default value", () => {
            const value = env("UNDEFINED", { default: "DEFAULT" });
            expect(value).to.equal("DEFAULT");
        });
    });

    describe("when `parse` option is set, returns parse(value)", () => {
        it("case: with `required` option", () => {
            const value = env("BASE64", {
                required: true,
                parse: v => Buffer.from(v, "base64")
            });
            expect(value).to.deep.equal(Buffer.from("BASE64"));
        });

        it("case: with `required` and `nonDefaultValue` options, NODE_ENV != production", () => {
            const value = env("UNDEFINED_BASE64", {
                required: true,
                // String NON_PRODUCTION_DEFAULT in base64
                nonProductionDefault: "Tk9OX1BST0RVQ1RJT05fREVGQVVMVA==",
                parse: v => Buffer.from(v, "base64")
            });
            expect(value).to.deep.equal(Buffer.from("NON_PRODUCTION_DEFAULT"));
        });

        it("case: with `default` option, variable defined", () => {
            const value = env("BASE64", {
                // String DEFAULT in base64
                default: "REVGQVVMVA==",
                parse: v => Buffer.from(v, "base64")
            });
            expect(value).to.deep.equal(Buffer.from("BASE64"));
        });

        it("case: with `default` option, variable not defined", () => {
            const value = env("UNDEFINED_BASE64", {
                // String DEFAULT in base64
                default: "REVGQVVMVA==",
                parse: v => Buffer.from(v, "base64")
            });
            expect(value).to.deep.equal(Buffer.from("DEFAULT"));
        });
    });
});
