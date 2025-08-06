"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.bracketed = void 0;
exports.stringArgument = stringArgument;
exports.multipleStringArguments = multipleStringArguments;
exports.multipleExistingFileArguments = multipleExistingFileArguments;
exports.existingFileArgument = existingFileArgument;
exports.existingDirectoryArgument = existingDirectoryArgument;
exports.isDirectory = isDirectory;
exports.isFile = isFile;
exports.numericStringArgument = numericStringArgument;
exports.numberArgument = numberArgument;
exports.booleanArgument = booleanArgument;
exports.arrayArgument = arrayArgument;
exports.functionArgument = functionArgument;
exports.objectArgument = objectArgument;
exports.enumArgument = enumArgument;
exports.existingPathArgument = existingPathArgument;
/**
 * @file src/utils/argumentValidation.ts
 * @description moved the content of parameter type checks at the start of
 * functions to here. use these when you want your function to throw a fit when
 * it receives bad input.
 */
const typeValidation_1 = require("./typeValidation");
const setupLog_1 = require("../config/setupLog");
const regex_1 = require("./regex");
const fs = __importStar(require("fs"));
/**
 * - {@link isNonEmptyString}`(value: any): value is string & { length: number; }`
 * @param source `string` indicating what called `validateStringArgument()`
 * @param arg2 `string | { [label: string]: any }` the argument/parameter name
 * @param value `string` the value passed into the `source`
 * for the argument corresponding to `label`
 * @throws {Error} if `value` is not a non-empty string
 *
 * **`message`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected ${label} to be: non-empty string`
 * -  `Received ${label} value: ${typeof value}`
 */
function stringArgument(source, arg2, value) {
    let label = '';
    if (typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            setupLog_1.mainLogger.error(`[argumentValidation.stringArgument()] Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
            throw new Error(`[argumentValidation.stringArgument()] Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (!(0, typeValidation_1.isNonEmptyString)(value)) {
        setupLog_1.mainLogger.error([`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: non-empty string`,
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE));
        throw new Error([`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: non-empty string`,
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE));
    }
}
/**
 * @param source `string`
 * @param labeledStrings `Record<string, any>` - map name of string param to value passed in for it
 */
function multipleStringArguments(source, labeledStrings) {
    for (const [label, value] of Object.entries(labeledStrings)) {
        stringArgument(source, label, value);
    }
}
function multipleExistingFileArguments(source, extension, labeledFilePaths) {
    for (const [label, value] of Object.entries(labeledFilePaths)) {
        existingFileArgument(source, extension, label, value);
    }
}
function existingFileArgument(source, extension, arg3, value) {
    let label = '';
    if (typeof arg3 === 'object') {
        const keys = Object.keys(arg3);
        if (keys.length !== 1) {
            throw new Error(`[argumentValidation.existingFileArgument()] Invalid argument: '${JSON.stringify(arg3)}' - expected a single key`);
        }
        label = keys[0];
        value = arg3[label];
    }
    if (!(0, typeValidation_1.isNonEmptyString)(value)
        || !(0, regex_1.stringEndsWithAnyOf)(value, extension, regex_1.RegExpFlagsEnum.IGNORE_CASE)
        || !isFile(value)) {
        const message = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: existing file with extension '${extension}'`,
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(message);
        throw new Error(message);
    }
}
function existingDirectoryArgument(source, arg2, value) {
    let label = '';
    if (typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            throw new Error(`[argumentValidation.existingDirectoryArgument()] Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (!(0, typeValidation_1.isNonEmptyString)(value) || !isDirectory(value)) {
        const message = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: existing directory`,
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(message);
        throw new Error(message);
    }
}
function isDirectory(pathString) {
    return fs.existsSync(pathString) && fs.statSync(pathString).isDirectory();
}
function isFile(pathString) {
    return fs.existsSync(pathString) && fs.statSync(pathString).isFile();
}
function numericStringArgument(source, arg2, value) {
    let label = '';
    if (typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            throw new Error(`[argumentValidation.numericStringArgument()] Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (typeof value !== typeValidation_1.TypeOfEnum.NUMBER
        && (typeof value !== typeValidation_1.TypeOfEnum.STRING || !(0, typeValidation_1.isNumericString)(value))) {
        const message = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: number or string (numeric string)`,
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(message);
        throw new Error(message);
    }
}
/**
 * @param source `string` indicating what called `validateNumberArgument()`
 * @param arg2 `string | { [label: string]: any }` the argument/parameter name
 * @param arg3 `any` the value passed into the `source`
 * for the argument corresponding to `label`
 * @param requireInteger `boolean` optional, if `true`, validates that `value` is an integer
 * - `default` is `false`, meaning `value` can be a float
 * @throws {Error} if `value` is not a number or is not an integer (if `requireInteger` is `true`)
 *
 * **`message`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected ${label} to be: number|integer`
 * -  `Received ${label} value: ${typeof value}`
 */
function numberArgument(source, arg2, arg3, requireInteger = false) {
    let label = '';
    let value = arg3;
    if (typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            throw new Error(`[argumentValidation.numberArgument()] Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
        if (typeof arg3 === 'boolean') {
            requireInteger = arg3;
        }
    }
    if (typeof value !== typeValidation_1.TypeOfEnum.NUMBER || isNaN(value)) {
        const message = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: number`,
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(message);
        throw new Error(message);
    }
    if (requireInteger && !Number.isInteger(value)) {
        const message = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: integer`,
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(message);
        throw new Error(message);
    }
}
/**
 * @param source `string` indicating what called `validateBooleanArgument()`
 * @param arg2 `string | { [label: string]: any }` the argument/parameter name
 * @param value `any` the value passed into the `source`
 * for the argument corresponding to `label`
 *
 * @throws {Error} `if` `value` is not a `boolean`
 *
 * **`message`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected ${label} to be: boolean`
 * -  `Received ${label} value: ${typeof value}`
 */
function booleanArgument(source, arg2, value) {
    let label = '';
    if (typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            throw new Error(`[argumentValidation.booleanArgument()] Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (typeof value !== typeValidation_1.TypeOfEnum.BOOLEAN) {
        throw new Error([`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: ${typeValidation_1.TypeOfEnum.BOOLEAN}`,
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE));
    }
}
/**
 * - {@link isNonEmptyArray}`(value: any): value is any[] & { length: number; }`
 * @param source `string` indicating what called `validateArrayArgument`
 * @param arg2 `string | { [label: string]: any }` the argument/parameter name or a single object dict mapping label to value
 * @param arg3 `any | TypeOfEnum | string` the value passed into the `source` or the element type
 * @param arg4 `TypeOfEnum | string | (value: any) => boolean` optional, element type or type guard function
 * @param arg5 `(value: any) => boolean | boolean` optional, type guard function or allowEmpty boolean
 * @param arg6 `boolean` optional, if `true`, allows `value` to be an empty array
 * - `default` is `false`, meaning an empty array will throw an error
 * @throws {Error} `if` `value` is not a non-empty array or does not pass the type checks
 *
 * **`message`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected ${label} to be: non-empty array`
 * -  `Received ${label} value: ${typeof value}`
 *
 * `if` `elementTypeGuard` is provided:
 * -  `Expected ${label} to be: non-empty array of ${elementType}`
 * -  `Received ${label} value: ${JSON.stringify(value)}`
 * -  `Element typeGuard function: ${elementTypeGuard.name}(value: any): value is ${elementType}`
 */
function arrayArgument(source, 
/** label or single object dict mapping label to value */
arg2, 
/** value (any) | elementType (TypeOfEnum | string) */
arg3, 
/** elementType (TypeOfEnum | string) | elementTypeGuard (function) */
arg4, 
/** elementTypeGuard | allowEmpty (boolean) */
arg5, arg6 = false) {
    let label = '';
    let value = undefined;
    if (typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            const message = `[argumentValidation.arrayArgument()] Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`;
            setupLog_1.mainLogger.error(message);
            throw new Error(message);
        }
        label = keys[0];
        value = arg2[label];
    }
    else if (typeof arg2 === 'string') {
        label = arg2;
        value = arg3;
    }
    else {
        throw new Error(`[argumentValidation.arrayArgument()] Invalid parameters: expected either a single object with a single key ({label: value}) or two separate arguments (label, value)`);
    }
    // Parse the parameters based on the overload signature used
    let elementType;
    let elementTypeGuard;
    let allowEmpty = arg6;
    if (typeof arg2 === 'object') {
        // Called with {label: value}, elementType?, elementTypeGuard?, allowEmpty?
        elementType = arg3;
        elementTypeGuard = arg4;
        allowEmpty = arg5 || arg6;
    }
    else {
        // Called with label, value, elementType?, elementTypeGuard?, allowEmpty?
        elementType = arg4;
        elementTypeGuard = arg5;
        allowEmpty = arg6;
    }
    if (!Array.isArray(value)) {
        const message = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: array`,
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(message);
        throw new Error(message);
    }
    if ((0, typeValidation_1.isEmptyArray)(value) && !allowEmpty) {
        const message = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: non-empty array`,
            `Received ${label} value: empty array`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(message);
        throw new Error(message);
    }
    if (elementType && Object.values(typeValidation_1.TypeOfEnum).includes(elementType)) {
        if (!value.every((v) => typeof v === elementType)) {
            const message = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
                `Expected ${label} to be: array of ${elementType}`,
                `Received ${label} value: ${JSON.stringify(value)}`
            ].join(setupLog_1.INDENT_LOG_LINE);
            setupLog_1.mainLogger.error(message);
            throw new Error(message);
        }
    }
    if (elementTypeGuard && typeof elementTypeGuard === 'function') {
        if (!value.every((v) => elementTypeGuard(v))) {
            const message = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
                `Expected ${label} to be: Array` + (0, typeValidation_1.isNonEmptyString)(elementType) ? `<${elementType}>` : ``,
                `Received ${label} value: ${JSON.stringify(value)}`,
                `Element typeGuard function: ${elementTypeGuard.name}`
            ].join(setupLog_1.INDENT_LOG_LINE);
            setupLog_1.mainLogger.error(message);
            throw new Error(message);
        }
    }
}
/**
 * @param source `string` indicating what called `validateFunctionArgument`
 * @param arg2 `string` the argument/parameter name
 * @param value `any` the value passed into the `source`
 * for the argument corresponding to `label`
 *
 * @throws {Error} `if` `value` is not a function
 *
 * **`message`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected ${label} to be: function`
 * -  `Received ${label} value: ${typeof value}`
 */
function functionArgument(source, arg2, value) {
    let label = '';
    if (typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            throw new Error(`[argumentValidation.functionArgument()] Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (typeof value !== 'function') {
        throw new Error([`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: function`,
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE));
    }
}
/**
 * @note does not allow for arrays
 * @param source `string` indicating what called `validateObjectArgument`
 * @param arg2 `string | { [label: string]: any }` the argument/parameter name or a single object dict mapping label to value
 * @param arg3 `any | string` the value passed into the `source` or the object type name
 * @param arg4 `string | (value: any) => boolean` optional, a type guard function or the object type name if arg3 was the object value
 * @param arg5 `boolean | (value: any) => boolean | undefined` optional, a type guard function if arg4 was the object type name or `boolean` for the allowEmpty param
 * @param allowEmpty `boolean` optional, if `true`, allows `value` to be an empty object `{} or undefined` (if arg5 was the type guard function)
 * @throws {Error} `if` `value` is not a non-empty object
 * or does not pass the type guard (if one was provided)
 *
 * **`message`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected ${label} to be: non-empty 'object'`
 * -  `Received ${label} value: ${typeof value}`
 *
 * `if` `objectTypeGuard` is provided:
 * -  `Expected ${label} to be: object of type '${objectTypeName}'`
 * -  `Received ${label} value: ${JSON.stringify(value)}`
 * -  `Element typeGuard function: ${objectTypeGuard.name}(value: any): value is ${objectTypeName}`
 */
function objectArgument(source, 
/** label or single object dict mapping label to value */
arg2, 
/** value (any) | objectTypeName (string) */
arg3, 
/** objectTypeName (string) | objectTypeGuard (function) */
arg4, 
/** objectTypeGuard | allowEmpty (boolean) */
arg5, allowEmpty = false) {
    let label = '';
    let value = undefined;
    if (typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            throw new Error(`[argumentValidation.objectArgument()] Invalid argument: '${JSON.stringify(label)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
    }
    else if (typeof arg2 === 'string') {
        label = arg2;
        value = arg3;
    }
    else {
        throw new Error(`[argumentValidation.objectArgument()] Invalid parameters: expected either a single object with a single key ({label: value}) or two separate arguments (label, value)`);
    }
    let objectTypeName = (typeof arg3 === 'string'
        ? arg3
        : `object (Record<string, any>)`);
    let objectTypeGuard = (typeof arg4 === 'function'
        ? arg4
        : (typeof arg5 === 'function'
            ? arg5
            : undefined));
    if (typeof value !== 'object' || Array.isArray(value) || ((0, typeValidation_1.isNullLike)(value) && !allowEmpty)) {
        throw new Error([`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: non-array, non-empty object`,
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE));
    }
    if (objectTypeGuard
        && typeof objectTypeGuard === 'function'
        && !objectTypeGuard(value)) {
        throw new Error([`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: object of type '${objectTypeName}'`,
            `Received ${label} value: ${JSON.stringify(value)}`,
            `Element typeGuard function: ${objectTypeGuard.name}`
        ].join(setupLog_1.INDENT_LOG_LINE));
    }
}
/**
 * @param source `string` indicating what called `enumArgument()`
 * @param arg2 `string | { [enumLabel: string]: Record<string, string> | Record<string, number> }`
 * the enum label or labeled enum object
 * @param arg3 `Record<string, string> | Record<string, number> | { [label: string]: any }`
 * the enum object or labeled value object
 * @param arg4 `string | undefined` the argument label (if using first overload)
 * @param value `any` the value to validate (if using first overload)
 * @returns {string | number} the validated enum value
 * @throws {Error} if `value` is not a valid enum value
 *
 * **String Enums**: Flexible case-insensitive matching for both keys and values
 * - Input can be a string that matches any enum key or value (case-insensitive)
 * - Non-string inputs must exactly match an enum value
 *
 * **Number Enums**: Key or exact value matching
 * - String input must exactly match an enum key (case-sensitive)
 * - Number input must exactly match an enum value
 *
 * **`message`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected ${label} to be: valid ${enumLabel} enum key or value`
 * -  `Received ${label} value: ${value} (${typeof value})`
 * -  `Valid ${enumLabel} options: [key1, value1, key2, value2, ...]`
 */
function enumArgument(source, arg2, arg3, arg4, value) {
    let enumLabel = '';
    let enumObject;
    let label = '';
    let valueToCheck;
    if (typeof arg2 === 'string') {
        // First overload: (source, enumLabel, enumObject, label, value)
        enumLabel = arg2;
        enumObject = arg3;
        label = arg4;
        valueToCheck = value;
    }
    else if (typeof arg2 === 'object') {
        // Second overload: (source, labeledEnumObject, labeledValue)
        const enumKeys = Object.keys(arg2);
        if (enumKeys.length !== 1) {
            throw new Error(`[argumentValidation.enumArgument()] Invalid argument: '${JSON.stringify(arg2)}' - expected a single key for enum object`);
        }
        enumLabel = enumKeys[0];
        enumObject = arg2[enumLabel];
        const valueKeys = Object.keys(arg3);
        if (valueKeys.length !== 1) {
            throw new Error(`[argumentValidation.enumArgument()] Invalid argument: '${JSON.stringify(arg3)}' - expected a single key for value object`);
        }
        label = valueKeys[0];
        valueToCheck = arg3[label];
    }
    else {
        throw new Error(`[argumentValidation.enumArgument()] Invalid parameters: expected either (enumLabel, enumObject, label, value) or ({enumLabel: enumObject}, {label: value})`);
    }
    // Validate that enumObject is provided and is an object
    if (!enumObject || typeof enumObject !== 'object') {
        throw new Error(`[argumentValidation.enumArgument()] Invalid enum object for '${enumLabel}': expected non-empty object`);
    }
    const enumKeys = Object.keys(enumObject);
    const enumValues = Object.values(enumObject);
    // Determine if this is a string or number enum
    const isStringEnum = enumValues.every(val => typeof val === 'string');
    const isNumberEnum = enumValues.every(val => typeof val === 'number');
    if (!isStringEnum && !isNumberEnum) {
        throw new Error(`[argumentValidation.enumArgument()] Invalid enum object for '${enumLabel}': enum values must be all strings or all numbers`);
    }
    let matchedValue;
    if (isStringEnum) {
        // For string enums, check both keys and values with case-insensitive matching
        if (typeof valueToCheck === 'string') {
            const lowerValueToCheck = valueToCheck.toLowerCase();
            // Check if it matches a key (case-insensitive)
            const matchingKey = enumKeys.find(key => key.toLowerCase() === lowerValueToCheck);
            if (matchingKey) {
                matchedValue = enumObject[matchingKey];
            }
            else {
                // Check if it matches a value (case-insensitive)
                const matchingValue = enumValues.find(val => typeof val === 'string' && val.toLowerCase() === lowerValueToCheck);
                if (matchingValue) {
                    matchedValue = matchingValue;
                }
            }
        }
        else {
            // For non-string input, only check exact value match
            if (enumValues.includes(valueToCheck)) {
                matchedValue = valueToCheck;
            }
        }
    }
    else if (isNumberEnum) {
        // For number enums, check if value is a number or string key
        if (typeof valueToCheck === 'number' && enumValues.includes(valueToCheck)) {
            matchedValue = valueToCheck;
        }
        else if (typeof valueToCheck === 'string') {
            // Check if string matches a key (case-sensitive for number enums)
            if (enumKeys.includes(valueToCheck)) {
                matchedValue = enumObject[valueToCheck];
            }
        }
    }
    if (matchedValue === undefined) {
        const validOptions = isStringEnum
            ? [...enumKeys, ...enumValues].map(v => `'${v}'`).join(', ')
            : [...enumKeys, ...enumValues].join(', ');
        const message = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: valid ${enumLabel} enum ${isStringEnum ? 'key or value' : 'key (string) or value (number)'}`,
            `Received ${label} value: ${valueToCheck} (${typeof valueToCheck})`,
            `Valid ${enumLabel} options: [${validOptions}]`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(message);
        throw new Error(message);
    }
    return matchedValue;
}
/**
 * @description surrounds `s` with brackets if it doesn't already have them
 * @param s `string`
 * @returns **`bracketedString`** `string`
 */
const bracketed = (s) => {
    if (!(0, typeValidation_1.isNonEmptyString)(s))
        s = 'argumentValidation';
    s = s.trim();
    if (!/^\[.*\]$/.test(s)) {
        s = `[${s}()]`;
    }
    return s;
};
exports.bracketed = bracketed;
/** */
function existingPathArgument(source, arg2, value, extension) {
    let label = '';
    if (typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            throw new Error(`[argumentValidation.existingPathArgument()] Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (!(0, typeValidation_1.isNonEmptyString)(value) || !fs.existsSync(value)
        && ((0, typeValidation_1.isNonEmptyString)(extension)
            ? value.toLowerCase().endsWith(extension.toLowerCase())
            : true)) {
        const message = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected ${label} to be: existing path`
                + ((0, typeValidation_1.isNonEmptyString)(extension) ? ` with extension '${extension}'` : ``),
            `Received ${label} value: ${typeof value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(message);
        throw new Error(message);
    }
}
