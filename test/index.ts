import { expect } from "chai";

import env from "../src";

describe("The env function", () => {
    process.env = {
        DEFINED: "DEFINED",
        UNDEFINED: undefined,
        // String BASE64 in base64
        BASE64: "QkFTRTY0"
    };

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

    describe("when option `required` is set", () => {
        it("if the variable is defined, returns its value", () => {
            const value = env("DEFINED", { required: true });
            expect(value).to.equal("DEFINED");
        });
        it("if the variable is not defiend, throws", () => {
            const troublemaker = () => {
                env("UNDEFINED", { required: true });
            };
            expect(troublemaker).to.throw(
                "Required environment variable UNDEFINED is not set"
            );
        });
    });

    describe("when option `default` is set", () => {
        it("if the variable is defined, returns its value", () => {
            const value = env("DEFINED", { default: "default" });
            expect(value).to.equal("DEFINED");
        });
        it("if the variable is not defiend, returns the default value", () => {
            const value = env("UNDEFINED", { default: "default" });
            expect(value).to.equal("default");
        });
    });

    describe("when option `parse` is set, returns parse(value)", () => {
        it("case: with `required` option", () => {
            const value = env("BASE64", {
                required: true,
                parse: v => Buffer.from(v, "base64")
            });
            expect(value).to.deep.equal(Buffer.from("BASE64"));
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
            const value = env("UNDEFINED", {
                // String DEFAULT in base64
                default: "REVGQVVMVA==",
                parse: v => Buffer.from(v, "base64")
            });
            expect(value).to.deep.equal(Buffer.from("DEFAULT"));
        });
    });
});
