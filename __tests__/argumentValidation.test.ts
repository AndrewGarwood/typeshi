/**
 * @file ./__tests__/argumentValidation.test.ts
 */

import { test, describe, expect } from "@jest/globals";
import * as validate from "../src/utils/argumentValidation";
import path from "node:path";
// ============================================================================
// Test fixtures directory for IO-dependent tests
// ============================================================================
const FIXTURES_DIR = path.join(__dirname, "fixtures", "argumentValidation");

// ============================================================================
// stringArgument
// ============================================================================
describe("stringArgument", () => {
    test("should not throw for a valid non-empty string (label, value)", () => {
        expect(() => validate.stringArgument("testSource", "myLabel", "hello")).not.toThrow();
    });

    test("should not throw for a valid non-empty string (object form)", () => {
        expect(() => validate.stringArgument("testSource", { myLabel: "hello" })).not.toThrow();
    });

    test("should throw for empty string value", () => {
        expect(() => validate.stringArgument("testSource", "myLabel", "")).toThrow();
    });

    test("should throw for undefined value", () => {
        expect(() => validate.stringArgument("testSource", "myLabel", undefined)).toThrow();
    });

    test("should throw for null value", () => {
        expect(() => validate.stringArgument("testSource", "myLabel", null)).toThrow();
    });

    test("should throw for number value", () => {
        expect(() => validate.stringArgument("testSource", "myLabel", 123)).toThrow();
    });

    test("should throw for boolean value", () => {
        expect(() => validate.stringArgument("testSource", "myLabel", true)).toThrow();
    });

    test("should throw for object value (object form)", () => {
        expect(() => validate.stringArgument("testSource", { myLabel: {} })).toThrow();
    });

    test("error message includes source and label", () => {
        expect(() => validate.stringArgument("myFunc", "paramName", 42))
            .toThrow(/paramName/);
    });
});

// ============================================================================
// multipleStringArguments
// ============================================================================
describe("multipleStringArguments", () => {
    test("should not throw when all values are non-empty strings", () => {
        expect(() =>
            validate.multipleStringArguments("testSource", {
                name: "Bob",
                city: "Seattle",
            })
        ).not.toThrow();
    });

    test("should throw when any value is not a non-empty string", () => {
        expect(() =>
            validate.multipleStringArguments("testSource", {
                name: "Bob",
                age: 25,
            })
        ).toThrow();
    });

    test("should throw when any value is empty string", () => {
        expect(() =>
            validate.multipleStringArguments("testSource", {
                name: "Bob",
                city: "",
            })
        ).toThrow();
    });
});

// ============================================================================
// numberArgument
// ============================================================================
describe("numberArgument", () => {
    test("should not throw for a valid number (label, value)", () => {
        expect(() => validate.numberArgument("testSource", "count", 5)).not.toThrow();
    });

    test("should not throw for a valid number (object form)", () => {
        expect(() => validate.numberArgument("testSource", { count: 5 })).not.toThrow();
    });

    test("should not throw for float when requireInteger is false", () => {
        expect(() => validate.numberArgument("testSource", "ratio", 3.14)).not.toThrow();
    });

    test("should not throw for integer when requireInteger is true", () => {
        expect(() => validate.numberArgument("testSource", "count", 5, true)).not.toThrow();
    });

    test("should throw for float when requireInteger is true", () => {
        expect(() => validate.numberArgument("testSource", "count", 3.14, true)).toThrow();
    });

    test("should throw for NaN", () => {
        expect(() => validate.numberArgument("testSource", "count", NaN)).toThrow();
    });

    test("should throw for string value", () => {
        expect(() => validate.numberArgument("testSource", "count", "five")).toThrow();
    });

    test("should throw for undefined", () => {
        expect(() => validate.numberArgument("testSource", "count", undefined)).toThrow();
    });

    test("should throw for null", () => {
        expect(() => validate.numberArgument("testSource", "count", null)).toThrow();
    });

    test("should not throw for negative number", () => {
        expect(() => validate.numberArgument("testSource", "offset", -10)).not.toThrow();
    });

    test("should not throw for zero", () => {
        expect(() => validate.numberArgument("testSource", "index", 0)).not.toThrow();
    });

    test("object form with requireInteger", () => {
        expect(() => validate.numberArgument("testSource", { count: 5 }, true)).not.toThrow();
        expect(() => validate.numberArgument("testSource", { count: 5.5 }, true)).toThrow();
    });
});


// ============================================================================
// booleanArgument
// ============================================================================
describe("booleanArgument", () => {
    test("should not throw for true (label, value)", () => {
        expect(() => validate.booleanArgument("testSource", "flag", true)).not.toThrow();
    });

    test("should not throw for false (label, value)", () => {
        expect(() => validate.booleanArgument("testSource", "flag", false)).not.toThrow();
    });

    test("should not throw for boolean (object form)", () => {
        expect(() => validate.booleanArgument("testSource", { flag: true })).not.toThrow();
    });

    test("should throw for string 'true'", () => {
        expect(() => validate.booleanArgument("testSource", "flag", "true")).toThrow();
    });

    test("should throw for number 1", () => {
        expect(() => validate.booleanArgument("testSource", "flag", 1)).toThrow();
    });

    test("should throw for undefined", () => {
        expect(() => validate.booleanArgument("testSource", "flag", undefined)).toThrow();
    });

    test("should throw for null", () => {
        expect(() => validate.booleanArgument("testSource", "flag", null)).toThrow();
    });
});

// ============================================================================
// functionArgument
// ============================================================================
describe("functionArgument", () => {
    test("should not throw for a valid function (label, value)", () => {
        expect(() =>
            validate.functionArgument("testSource", "callback", () => {})
        ).not.toThrow();
    });

    test("should not throw for a named function", () => {
        function myFunc() {}
        expect(() =>
            validate.functionArgument("testSource", "callback", myFunc)
        ).not.toThrow();
    });

    test("should not throw for function (object form)", () => {
        expect(() =>
            validate.functionArgument("testSource", { callback: () => {} })
        ).not.toThrow();
    });

    test("should throw for string value", () => {
        expect(() =>
            validate.functionArgument("testSource", "callback", "notAFunction")
        ).toThrow();
    });

    test("should throw for undefined", () => {
        expect(() =>
            validate.functionArgument("testSource", "callback", undefined)
        ).toThrow();
    });

    test("should throw for number", () => {
        expect(() =>
            validate.functionArgument("testSource", "callback", 42)
        ).toThrow();
    });
});

// ============================================================================
// arrayArgument
// ============================================================================
describe("arrayArgument", () => {
    test("should not throw for a non-empty array", () => {
        expect(() =>
            validate.arrayArgument("testSource", "items", [1, 2, 3])
        ).not.toThrow();
    });

    test("should throw for an empty array when allowEmpty is false", () => {
        expect(() =>
            validate.arrayArgument("testSource", "items", [], undefined, undefined, false)
        ).toThrow();
    });

    test("should not throw for empty array when allowEmpty is true", () => {
        expect(() =>
            validate.arrayArgument("testSource", "items", [], undefined, undefined, true)
        ).not.toThrow();
    });

    test("should throw for non-array value", () => {
        expect(() =>
            validate.arrayArgument("testSource", "items", "not an array")
        ).toThrow();
    });

    test("should throw for undefined value", () => {
        expect(() =>
            validate.arrayArgument("testSource", "items", undefined)
        ).toThrow();
    });

    test("should throw for null value", () => {
        expect(() =>
            validate.arrayArgument("testSource", "items", null)
        ).toThrow();
    });

    test("should validate with elementType and elementTypeGuard", () => {
        const isString = (v: any): v is string => typeof v === "string";
        expect(() =>
            validate.arrayArgument("testSource", "names", ["a", "b"], "string", isString)
        ).not.toThrow();
    });

    test("should throw when elements don't match type guard", () => {
        const isString = (v: any): v is string => typeof v === "string";
        expect(() =>
            validate.arrayArgument("testSource", "names", [1, 2], "string", isString)
        ).toThrow();
    });

    test("object form - should not throw for valid array", () => {
        expect(() =>
            validate.arrayArgument("testSource", { items: [1, 2, 3] })
        ).not.toThrow();
    });

    test("object form - should throw for empty array when allowEmpty is false", () => {
        expect(() =>
            validate.arrayArgument("testSource", { items: [] }, false)
        ).toThrow();
    });
});

// ============================================================================
// objectArgument
// ============================================================================
describe("objectArgument", () => {
    test("should not throw for a valid non-empty object", () => {
        expect(() =>
            validate.objectArgument("testSource", "config", { key: "value" })
        ).not.toThrow();
    });

    test("should throw for a non-object (string)", () => {
        expect(() =>
            validate.objectArgument("testSource", "config", "not an object")
        ).toThrow();
    });

    test("should throw for null", () => {
        expect(() =>
            validate.objectArgument("testSource", "config", null)
        ).toThrow();
    });

    test("should throw for undefined", () => {
        expect(() =>
            validate.objectArgument("testSource", "config", undefined)
        ).toThrow();
    });

    test("should throw for array when no array type guard", () => {
        expect(() =>
            validate.objectArgument("testSource", "config", [1, 2, 3])
        ).toThrow();
    });

    test("should not throw with objectTypeGuard that passes", () => {
        const isMyType = (v: any): boolean =>
            typeof v === "object" && v !== null && "key" in v;
        expect(() =>
            validate.objectArgument(
                "testSource",
                "config",
                { key: "value" },
                "MyType",
                isMyType
            )
        ).not.toThrow();
    });

    test("should throw with objectTypeGuard that fails", () => {
        const isMyType = (v: any): boolean =>
            typeof v === "object" && v !== null && "requiredKey" in v;
        expect(() =>
            validate.objectArgument(
                "testSource",
                "config",
                { key: "value" },
                "MyType",
                isMyType
            )
        ).toThrow();
    });

    test("object form - should not throw for valid object", () => {
        expect(() =>
            validate.objectArgument("testSource", { config: { key: "value" } })
        ).not.toThrow();
    });
});

// ============================================================================
// numericStringArgument
// ============================================================================
describe("numericStringArgument", () => {
    test("should not throw for numeric string '123'", () => {
        expect(() =>
            validate.numericStringArgument("testSource", { value: "123" })
        ).not.toThrow();
    });

    test("should not throw for numeric string '3.14'", () => {
        expect(() =>
            validate.numericStringArgument("testSource", { value: "3.14" })
        ).not.toThrow();
    });

    test("should throw for non-numeric string 'abc'", () => {
        expect(() =>
            validate.numericStringArgument("testSource", { value: "abc" })
        ).toThrow();
    });

    test("should throw for float string when requireInteger is true", () => {
        expect(() =>
            validate.numericStringArgument("testSource", { value: "3.14" }, true)
        ).toThrow();
    });

    test("should not throw for integer string when requireInteger is true", () => {
        expect(() =>
            validate.numericStringArgument("testSource", { value: "42" }, true)
        ).not.toThrow();
    });

    test("should throw for negative string when requireNonNegative is true", () => {
        expect(() =>
            validate.numericStringArgument("testSource", { value: "-5" }, false, true)
        ).toThrow();
    });

    test("should not throw for positive string when requireNonNegative is true", () => {
        expect(() =>
            validate.numericStringArgument("testSource", { value: "5" }, false, true)
        ).not.toThrow();
    });
});
// ============================================================================
// existingFileArgument (IO - uses fixtures)
// ============================================================================
describe("existingFileArgument", () => {

    test("should not throw for an existing .csv file", () => {
        const filePath = path.join(FIXTURES_DIR, "sample.csv");
        expect(() =>
            validate.existingFileArgument("testSource", ".csv", "filePath", filePath)
        ).not.toThrow();
    });

    test("should not throw for an existing .json file", () => {
        const filePath = path.join(FIXTURES_DIR, "sample.json");
        expect(() =>
            validate.existingFileArgument("testSource", ".json", "filePath", filePath)
        ).not.toThrow();
    });

    test("should throw for non-existent file", () => {
        expect(() =>
            validate.existingFileArgument(
                "testSource",
                ".csv",
                "filePath",
                path.join(FIXTURES_DIR, "does_not_exist.csv")
            )
        ).toThrow();
    });

    test("should throw for wrong extension", () => {
        const filePath = path.join(FIXTURES_DIR, "sample.csv");
        expect(() =>
            validate.existingFileArgument("testSource", ".json", "filePath", filePath)
        ).toThrow();
    });

    test("should not throw when extension is array and file matches one", () => {
        const filePath = path.join(FIXTURES_DIR, "sample.csv");
        expect(() =>
            validate.existingFileArgument(
                "testSource",
                [".csv", ".tsv"],
                "filePath",
                filePath
            )
        ).not.toThrow();
    });

    test("should throw for empty string path", () => {
        expect(() =>
            validate.existingFileArgument("testSource", ".csv", "filePath", "")
        ).toThrow();
    });

    test("object form - should not throw for existing file", () => {
        const filePath = path.join(FIXTURES_DIR, "sample.txt");
        expect(() =>
            validate.existingFileArgument("testSource", ".txt", { filePath })
        ).not.toThrow();
    });
});

// ============================================================================
// multipleExistingFileArguments (IO)
// ============================================================================
describe("multipleExistingFileArguments", () => {
    test("should not throw when all files exist with correct extension", () => {
        expect(() =>
            validate.multipleExistingFileArguments("testSource", [".csv", ".json"], {
                csvFile: path.join(FIXTURES_DIR, "sample.csv"),
                jsonFile: path.join(FIXTURES_DIR, "sample.json"),
            })
        ).not.toThrow();
    });

    test("should throw when one file does not exist", () => {
        expect(() =>
            validate.multipleExistingFileArguments("testSource", ".csv", {
                file1: path.join(FIXTURES_DIR, "sample.csv"),
                file2: path.join(FIXTURES_DIR, "missing.csv"),
            })
        ).toThrow();
    });
});

// ============================================================================
// existingDirectoryArgument (IO)
// ============================================================================
describe("existingDirectoryArgument", () => {
    test("should not throw for an existing directory", () => {
        expect(() =>
            validate.existingDirectoryArgument("testSource", "dirPath", FIXTURES_DIR)
        ).not.toThrow();
    });

    test("should throw for a non-existent directory", () => {
        expect(() =>
            validate.existingDirectoryArgument(
                "testSource",
                "dirPath",
                path.join(__dirname, "nonexistent_dir_12345")
            )
        ).toThrow();
    });

    test("should throw for a file path (not a directory)", () => {
        const filePath = path.join(FIXTURES_DIR, "sample.csv");
        expect(() =>
            validate.existingDirectoryArgument("testSource", "dirPath", filePath)
        ).toThrow();
    });

    test("should throw for empty string", () => {
        expect(() =>
            validate.existingDirectoryArgument("testSource", "dirPath", "")
        ).toThrow();
    });

    test("object form - should not throw for existing directory", () => {
        expect(() =>
            validate.existingDirectoryArgument("testSource", { dirPath: FIXTURES_DIR })
        ).not.toThrow();
    });
});
// ============================================================================
// enumArgument
// ============================================================================
describe("enumArgument", () => {
    enum Color {
        Red = "RED",
        Green = "GREEN",
        Blue = "BLUE",
    }

    enum NumericValueEnum {
        A = 0,
        B = 1,
        C = 2,
    }

    test("should return matched value for valid string enum value", () => {
        const result = validate.enumArgument(
            "testSource",
            "color",
            "RED",
            "Color",
            Color
        );
        expect(result).toBe("RED");
    });

    test("should match case-insensitively for string enums", () => {
        const result = validate.enumArgument(
            "testSource",
            "color",
            "red",
            "Color",
            Color
        );
        expect(result).toBe("RED");
    });

    test("should match enum key for string enums", () => {
        const result = validate.enumArgument(
            "testSource",
            "color",
            "Red",
            "Color",
            Color
        );
        // Should match either via key or value
        expect(typeof result).toBe("string");
    });

    test("should throw for invalid string enum value", () => {
        expect(() =>
            validate.enumArgument(
                "testSource",
                "color",
                "YELLOW",
                "Color",
                Color
            )
        ).toThrow();
    });

    test("should return matched value for valid numeric enum value", () => {
        const result = validate.enumArgument(
            "testSource",
            "num",
            0,
            "NumericValueEnum",
            NumericValueEnum as unknown as Record<string, number>
        );
        expect(result).toBe(0);
    });

    test("should match numeric enum by key name", () => {
        const result = validate.enumArgument(
            "testSource",
            "num",
            "A",
            "NumericValueEnum",
            NumericValueEnum as unknown as Record<string, number>
        );
        expect(result).toBe(0);
    });

    test("should throw for invalid numeric enum value", () => {
        expect(() =>
            validate.enumArgument(
                "testSource",
                "num",
                99,
                "NumericValueEnum",
                NumericValueEnum as unknown as Record<string, number>
            )
        ).toThrow();
    });
});
