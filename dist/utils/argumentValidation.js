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
exports.functionArgument = functionArgument;
exports.arrayArgument = arrayArgument;
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
const typeGuardNamePattern = /(?<=^is).*$/i;
/**
 * - {@link isNonEmptyString}`(value: any): value is string & { length: number; }`
 * @param source `string` indicating what called `validateStringArgument()`
 * @param arg2 `string | { [label: string]: any }` the argument/parameter name
 * @param value `string` the value passed into the `source`
 * for the argument corresponding to `label`
 * @throws {Error} if `value` is not a non-empty string
 *
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: non-empty string`
 * -  `Received '${label}' value: ${typeof value} = ${value}`
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
            `Expected '${label}' to be: non-empty string`,
            `Received '${label}' value: ${typeof value} = ${value}`
        ].join(setupLog_1.INDENT_LOG_LINE));
        throw new Error([`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected '${label}' to be: non-empty string`,
            `Received '${label}' value: ${typeof value} = ${value}`
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
        const msg = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected '${label}' to be: existing file with extension '${extension}'`,
            `Received '${label}' value: ${typeof value} = ${value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
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
        const msg = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected '${label}' to be: existing directory`,
            `Received '${label}' value: ${typeof value} = ${value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
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
        const msg = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected '${label}' to be: number or string (numeric string)`,
            `Received '${label}' value: ${typeof value} = ${value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
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
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: number | integer`
 * -  `Received '${label}' value: ${typeof value} = ${value}`
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
        const msg = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected '${label}' to be: number`,
            `Received '${label}' value: ${typeof value} = ${value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
    if (requireInteger && !Number.isInteger(value)) {
        const msg = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected '${label}' to be: integer`,
            `Received '${label}' value: ${typeof value} = ${value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
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
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: boolean`
 * -  `Received '${label}' value: ${typeof value} = ${value}`
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
            `Expected '${label}' to be: ${typeValidation_1.TypeOfEnum.BOOLEAN}`,
            `Received '${label}' value: ${typeof value} = ${value}`
        ].join(setupLog_1.INDENT_LOG_LINE));
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
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: function`
 * -  `Received '${label}' value: ${typeof value} = ${value}`
 */
function functionArgument(source, arg2, value) {
    let label = '';
    if (typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            let msg = [`[argumentValidation.functionArgument()] Invalid arg2 as labeledFunction`,
                `Expected: object with single key-value pair`,
                `Received: '${JSON.stringify(arg2)}'`,
            ].join(setupLog_1.INDENT_LOG_LINE);
            setupLog_1.mainLogger.error(msg);
            throw new Error(msg);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (typeof value !== 'function') {
        let msg = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected '${label}' to be: function`,
            `Received '${label}' value: ${typeof value} = ${value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
}
/**
 * @param source `string` indicating what called `validateArrayArgument`
 * @param labeledArray `{ [label: string]: any }` a single object dict mapping label to value
 * @param labeledElementTypeGuard `{ [functionName: string]: (value: any) => boolean }` a single object dict mapping type guard function name to the function
 * @param allowEmpty `boolean` optional, if `true`, allows `value` to be an empty array
 * @description This overload automatically derives the element type name from the type guard function name using regex.
 * For example, if the type guard function is named `isNonEmptyString`, the element type name will be extracted as `String`.
 */
function arrayArgument(source, 
/** `label (string) | labeledArgs { [label: string]: any | ((value: any) => boolean) }` */
arg2, 
/** `value (any) | allowEmpty (boolean)` */
arg3, 
/** elementType (TypeOfEnum | string) | undefined */
elementType, 
/** elementTypeGuard | allowEmpty (boolean) */
elementTypeGuard, allowEmpty) {
    const vSource = `[argumentValidation.arrayArgument()]`;
    source = (0, exports.bracketed)(source);
    let label = '';
    let value = undefined;
    if ((0, typeValidation_1.isNonEmptyString)(arg2)) {
        label = arg2;
        value = arg3;
        allowEmpty = allowEmpty ?? false;
    }
    else if (arg2 && typeof arg2 === 'object') {
        let keys = Object.keys(arg2);
        if (keys.length === 0 || keys.length > 2 || keys.some(k => !(0, typeValidation_1.isNonEmptyString)(k))) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as labeledArgs`,
                `Expected: object with at most 2 keys:`
                    + `{ [arrayLabel: string]: valueToCheck; [typeGuardFunctionName: string]?: typeGuardFunction }`,
                `Received: object with ${keys.length} key(s)`,
                `arg2: ${JSON.stringify(arg2)}`
            ].join(setupLog_1.INDENT_LOG_LINE);
            setupLog_1.mainLogger.error(msg);
            throw new Error(msg);
        }
        let variableLabel = Object.keys(arg2)
            .find(key => typeof arg2[key] !== 'function');
        if (!variableLabel) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as labeledArgs`,
                `Expected: object of size 2 with exactly 1 key whose value is a typeGuard function`,
                `Received: Object.values(arg2) = ${JSON.stringify(Object.values(arg2))}`
            ].join(setupLog_1.INDENT_LOG_LINE);
            setupLog_1.mainLogger.error(msg);
            throw new Error(msg);
        }
        label = variableLabel;
        value = arg2[variableLabel];
        allowEmpty = arg3 ?? false;
        let functionLabel = Object.keys(arg2)
            .find(key => typeof arg2[key] === 'function');
        if (functionLabel) {
            elementTypeGuard = arg2[functionLabel];
            const match = typeGuardNamePattern.exec(label);
            elementType = match ? match[0] : functionLabel;
        }
    }
    else {
        let msg = [`${source} -> ${vSource} Invalid parameter: 'arg2'`,
            `Expected: label (string) | labeledArgs ({ [label: string]: any | ((value: any) => boolean) })`,
            `Received: ${typeof arg2} = ${arg2}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
    if (!Array.isArray(value)) {
        let msg = [`${source} Invalid Array Argument: '${label}'`,
            `Expected '${label}' to be: Array` + (elementType ? `<${elementType}>` : ''),
            `Received '${label}' value: ${typeof value} = ${value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
    if (!allowEmpty && (0, typeValidation_1.isEmptyArray)(value)) {
        let msg = [`${source} Invalid Array Argument: '${label}'`,
            `Expected '${label}' to be: non-empty Array` + (elementType ? `<${elementType}>` : ''),
            `Received '${label}' value: empty array`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
    else if (allowEmpty && (0, typeValidation_1.isEmptyArray)(value)) {
        return;
    }
    // isNonEmptyArray === true
    if (typeof elementTypeGuard === 'function') {
        for (let i = 0; i < value.length; i++) {
            if (!elementTypeGuard(value[i])) {
                let msg = [`${source} Invalid Array Argument: '${label}'`,
                    `Expected '${label}' to be: Array` + (elementType ? `<${elementType}>` : '') +
                        ` (typeGuard used = '${elementTypeGuard.name}')`,
                    `Received '${label}' value: Array with invalid element at index ${i}`,
                    `array[i]: ${typeof value[i]} = ${JSON.stringify(value[i])}`
                ].join(setupLog_1.INDENT_LOG_LINE);
                setupLog_1.mainLogger.error(msg);
                throw new Error(msg);
            }
        }
    }
}
/**
 * @note **does not allow for arrays**
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: non-empty 'object'`
 * -  `Received '${label}' value: ${typeof value} = ${value}`
 *
 * `if` `objectTypeGuard` is provided:
 * -  `Expected '${label}' to be: object of type '${objectTypeName}'`
 * -  `Received '${label}' value: ${JSON.stringify(value)}`
 * -  `Element typeGuard function: ${objectTypeGuard.name}(value: any): value is ${objectTypeName}`
 */
function objectArgument(source, 
/** `label (string) | labeledArgs ({ [label: string]: any | ((value: any) => boolean) })` */
arg2, 
/** `value (any) | allowEmpty (boolean)` */
arg3, 
/** `objectTypeName (string) | allowEmpty (boolean)` */
objectTypeName, 
/** `objectTypeGuard | undefined` */
objectTypeGuard, 
/** `allowEmpty (boolean) | undefined` */
allowEmpty) {
    source = (0, exports.bracketed)(source);
    const vSource = `[argumentValidation.objectArgument()]`;
    let label = '';
    let value = undefined;
    if (typeof arg2 === 'string') {
        label = arg2;
        value = arg3;
        allowEmpty = allowEmpty ?? false;
    }
    else if (arg2 && typeof arg2 === 'object') {
        let keys = Object.keys(arg2);
        if (keys.length === 0 || keys.length > 2 || keys.some(k => !(0, typeValidation_1.isNonEmptyString)(k))) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as labeledArgs`,
                `Expected: object with at most 2 keys: `
                    + `{ [objectLabel: string]: valueToCheck; [typeGuardFunctionName: string]?: typeGuardFunction }`,
                `Received: object with ${keys.length} key(s)`,
                `arg2: ${JSON.stringify(arg2)}`
            ].join(setupLog_1.INDENT_LOG_LINE);
            setupLog_1.mainLogger.error(msg);
            throw new Error(msg);
        }
        let functionLabel = Object.keys(arg2)
            .find(key => typeof arg2[key] === 'function');
        let variableLabel = Object.keys(arg2)
            .find(key => typeof arg2[key] !== 'function');
        if (!variableLabel) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as labeledArgs`,
                `Expected: object with labeledObject entry and optional labledTypeGuard entry`,
                `Received: Object.values(arg2) = ${JSON.stringify(Object.values(arg2))}`
            ].join(setupLog_1.INDENT_LOG_LINE);
            setupLog_1.mainLogger.error(msg);
            throw new Error(msg);
        }
        label = variableLabel;
        value = arg2[variableLabel];
        allowEmpty = arg3 ?? false;
        if (functionLabel) {
            const match = typeGuardNamePattern.exec(functionLabel);
            objectTypeName = match ? match[0] : functionLabel;
            objectTypeGuard = arg2[functionLabel];
        }
    }
    else {
        let msg = [`${source} -> ${vSource} Invalid parameter: 'arg2'`,
            `Expected: label (string) | labeledArgs ({ [label: string]: any | ((value: any) => boolean) })`,
            `Received: ${typeof arg2} = ${arg2}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
    objectTypeName = objectTypeName || 'object Record<string, any>';
    if (typeof value !== 'object') {
        let msg = [`${source} Invalid Object Argument: '${label}'`,
            `Expected '${label}' to be: object of type '${objectTypeName}'`,
            `Received '${label}' value: ${typeof value} = ${value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
    if (value === null || value === undefined) {
        let msg = [`${source} Invalid Object Argument: '${label}' is null or undefined`,
            `Expected '${label}' to be: object of type '${objectTypeName}'`,
            `Received '${label}' value: ${value}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
    if (Array.isArray(value)) {
        let msg = [`${source} Invalid Object Argument: '${label}' is an Array`,
            `Expected '${label}' to be: object of type '${objectTypeName}'`,
            `Received '${label}' value: array of length ${value.length}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
    if (allowEmpty && Object.keys(value).length === 0) {
        return;
    }
    if (typeof objectTypeGuard === 'function' && !objectTypeGuard(value)) {
        let msg = [`${source} Invalid Object Argument: '${label}'`,
            `Expected: object of type '${objectTypeName} '` +
                `(typeGuard used = '${objectTypeGuard.name}')`,
            `Received: ${typeof value} = ${JSON.stringify(value, null, 4)}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
    // reached end -> value is a valid object
    return;
}
function isEnumObject(value) {
    return Boolean(value
        && typeof value === 'object' && Object.keys(value).length > 0
        && (Object.values(value).every(v => typeof v === 'string')
            ||
                Object.values(value).every(v => typeof v === 'number')));
}
/**
 * @param source `string` indicating what called `enumArgument()`
 * @param arg2 `string | { [enumLabel: string]: Record<string, string> | Record<string, number> }`
 * the enum label or labeled EnumObject
 * @param arg3 `Record<string, string> | Record<string, number> | { [label: string]: any }`
 * the EnumObject or labeled value object
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
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: valid ${enumLabel} enum key or value`
 * -  `Received '${label}' value: ${value} (${typeof value})`
 * -  `Valid ${enumLabel} options: [key1, value1, key2, value2, ...]`
 */
function enumArgument(source, 
/** `label (string) | labeledArgs ({ [label: string]: string | Record<string, number> | Record<string, string> })` */
arg2, value, enumLabel, enumObject) {
    const vSource = `[argumentValidation.enumArgument]`;
    let label = undefined;
    let valueToCheck;
    if ((0, typeValidation_1.isNonEmptyString)(arg2)) {
        label = arg2;
        valueToCheck = value;
    }
    else if (arg2 && typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 2 || keys.some(k => !(0, typeValidation_1.isNonEmptyString)(k))) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as labeledArgs`,
                `Expected: object with exactly 2 (string) keys: `
                    + `{ [valueLabel: string]: valueToCheck; [enumLabel: string]: enumObject }`,
                `Received: object with ${keys.length} key(s)`,
                `arg2 keys: ${JSON.stringify(keys)}`
            ].join(setupLog_1.INDENT_LOG_LINE);
            setupLog_1.mainLogger.error(msg);
            throw new Error(msg);
        }
        label = keys.find(key => typeof arg2[key] === 'number' || typeof arg2[key] === 'string');
        if (!label) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as labeledArgs`,
                `labeledArgs does not contain a value comparable to values of an EnumObject`,
                `Expected arg2 to have single entry of format [valueLabel: string]: (string | number)`
            ].join(setupLog_1.INDENT_LOG_LINE);
            setupLog_1.mainLogger.error(msg);
            throw new Error(msg);
        }
        valueToCheck = arg2[label];
        enumLabel = keys
            .filter(key => key !== label)
            .find(key => isEnumObject(arg2[key]));
        if (!enumLabel) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as labeledArgs`,
                `labeledArgs does not contain an entry with a value that is an EnumObject`,
                `Expected arg2 to have single entry of format [enumLabel: string]: EnumObject`
            ].join(setupLog_1.INDENT_LOG_LINE);
            setupLog_1.mainLogger.error(msg);
            throw new Error(msg);
        }
        enumObject = arg2[enumLabel];
    }
    else {
        let msg = [`${source} -> ${vSource} Invalid parameter 'arg2'`,
            `Expected 'arg2' to be either label (string) | labeledArgs (object)`,
            `Received ${typeof arg2} = ${arg2}`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
    if (!isEnumObject(enumObject)) {
        let msg = [`${source} -> ${vSource}.verbose: Invalid EnumObject for '${enumLabel}'`,
            `Expected non-empty object Record<string, number> | Record<string, string>`,
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
    const enumKeys = Object.keys(enumObject);
    const enumValues = Object.values(enumObject);
    const isStringEnum = enumValues.every(val => typeof val === 'string');
    const isNumberEnum = enumValues.every(val => typeof val === 'number');
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
        const msg = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected '${label}' to be: valid ${enumLabel} enum ${isStringEnum ? 'key or value' : 'key (string) or value (number)'}`,
            `Received '${label}' value: ${valueToCheck} (${typeof valueToCheck})`,
            `Valid ${enumLabel} options: [${validOptions}]`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
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
/** use existingFileArgument() or existingDirectoryArgument() */
function existingPathArgument(source, arg2, value, extension) {
    let label = '';
    if (typeof arg2 === 'object') {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            let msg = [`[argumentValidation.existingPathArgument()] Invalid argument: '${JSON.stringify(arg2)}'`,
                `Expected: object with a single key`,
                `Received: ${keys.length}`
            ].join(setupLog_1.INDENT_LOG_LINE);
            setupLog_1.mainLogger.error(msg);
            throw new Error(msg);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (!(0, typeValidation_1.isNonEmptyString)(value) || !fs.existsSync(value)
        && ((0, typeValidation_1.isNonEmptyString)(extension)
            ? value.toLowerCase().endsWith(extension.toLowerCase())
            : true)) {
        const msg = [`${(0, exports.bracketed)(source)} Invalid argument: '${label}'`,
            `Expected '${label}' to be: existing path`
                + ((0, typeValidation_1.isNonEmptyString)(extension) ? ` with extension '${extension}'` : ``),
            `Received '${label}' value: ${typeof value} = '${value}'`
        ].join(setupLog_1.INDENT_LOG_LINE);
        setupLog_1.mainLogger.error(msg);
        throw new Error(msg);
    }
}
// function logAndThrow(errorMsg: string): void {
//     mlog.error(errorMsg);
//     throw new Error(errorMsg);
// }
