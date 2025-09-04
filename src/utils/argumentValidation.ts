/**
 * @file src/utils/argumentValidation.ts
 * @description moved the content of parameter type checks at the start of 
 * functions to here. use these when you want your function to throw a fit when
 * it receives bad input.
 * @TODO add boolean value configurable by a setter function that specifies if errors should be thrown or only logged
 * - maybe add a configurable value that the validation functions should return if the validation test fails
 * - change the validation functions such that they return the validated value, if possible?
 * - or maybe have them return boolean type predicates ? 
 * - -> maybe have to make a class
 */
import { 
    isNonEmptyString, isNonEmptyArray, isNullLike, hasKeys, isEmptyArray, 
    TypeOfEnum, 
    isNumeric,
    isObject,
    isStringArray,
    isInteger
} from "./typeValidation";
import { 
    typeshiLogger as mlog, INDENT_LOG_LINE as TAB, NEW_LINE as NL 
} from "../config/setupLog";
import { RegExpFlagsEnum, stringEndsWithAnyOf } from "./regex";
import { extractFileName } from "./regex/misc"
import * as fs from "fs";
const F = extractFileName(__filename);

const typeGuardNamePattern = /(?<=^is).*$/i;

/**
 * - {@link isNonEmptyString}`(value: any): value is string & { length: number; }`
 * @param source `string` indicating what called `stringArgument()`
 * @param arg2 `string | { [label: string]: any }` the argument/parameter name
 * @param value `string` the value passed into the `source` 
 * for the argument corresponding to `label`
 * @throws **`Error`** if `value` is not a non-empty string
 * 
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: non-empty string`
 * -  `Received '${label}' value: ${typeof value} = '${value}'`
 */
export function stringArgument(
    source: string,
    arg2: string | { [label: string]: any },
    value?: any,
): void {
    source = bracketed(source);
    const vSource = getSourceString(F, stringArgument.name);
    let label: string = '';
    if (isObject(arg2)) {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            let msg = [`${source} -> ${vSource} Invalid 'arg2' as labeledString`,
                `Expected: object with single string key`,
                `Received: ${typeof arg2} = ${JSON.stringify(arg2)}`
            ].join(TAB)
            mlog.error(msg);
            throw new Error(msg);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (!isNonEmptyString(value)) {
        let msg = [`${source} Invalid argument: '${label}'`,
            `Expected '${label}' to be: non-empty string`,
            `Received '${label}' value: ${typeof value} = '${value}'`
        ].join(TAB);
        mlog.error(msg)
        throw new Error(msg);
    }
}

/**
 * @param source `string`
 * @param labeledStrings `Record<string, any>` - map name of string param to value passed in for it
 */
export function multipleStringArguments(
    source: string,
    labeledStrings: Record<string, any>
): void {
    for (const [label, value] of Object.entries(labeledStrings)) {
        stringArgument(source, label, value);
    }
}

export function multipleExistingFileArguments(
    source: string,
    extension: string | string[],
    labeledFilePaths: Record<string, string>
): void {
    for (const [label, value] of Object.entries(labeledFilePaths)) {
        existingFileArgument(source, extension, label, value);
    }
}

export function existingFileArgument(
    source: string,
    extension: string | string[],
    arg3: string | { [label: string]: any },
    value?: any,
): void {
    source = bracketed(source);
    const vSource = getSourceString(F, existingFileArgument.name);
    let label: string = '';
    if (isObject(arg3)) {
        const keys = Object.keys(arg3);
        if (keys.length !== 1) {
            throw new Error(`${source} -> ${vSource} Invalid argument: '${JSON.stringify(arg3)}' - expected a single key`);
        }
        label = keys[0];
        value = arg3[label];
    }
    if (!isNonEmptyString(value) 
        || !stringEndsWithAnyOf(value, extension, RegExpFlagsEnum.IGNORE_CASE)
        || !isFile(value)) {
        let msg = [`${source} Invalid argument: '${label}'`,
            `Expected '${label}' to be: existing file with `+(
                isStringArray(extension) 
                ? `one of the following extensions: ${JSON.stringify(extension)}`
                : `extension: '${extension}'`),
            `Received '${label}' value: ${typeof value} = '${value}'`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
}

export function existingDirectoryArgument(
    source: string,
    arg2: string | { [label: string]: any },
    value?: any,
): void {
    source = bracketed(source);
    const vSource = getSourceString(F, existingDirectoryArgument.name);
    let label: string = '';
    if (isObject(arg2)) {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            throw new Error(`${source} -> ${vSource} Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (!isNonEmptyString(value) || !isDirectory(value)) {
        let msg = [`${source} Invalid argument: '${label}'`,
            `Expected '${label}' to be: existing directory`,
            `Received '${label}' value: ${typeof value} = '${value}'`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
}

/**
 * - uses `isNumeric(value): value is string | number`
 * - to check whether `value` is either a `number` or a `string` that can be casted to a `number`
 * @param source `string`
 * @param arg2 `string | { [label: string]: any }`
 * @param requireInteger `boolean (optional)` `default` = `false` (argument passed into `isNumeric`)
 * @param requireNonNegative `boolean (optional)` `default` = `false` (argument passed into `isNumeric`)
 */
export function numericStringArgument(
    source: string,
    arg2: string | { [label: string]: any },
    requireInteger: boolean = false,
    requireNonNegative: boolean = false,
): void {
    const vSource = getSourceString(F, numericStringArgument.name);
    source = bracketed(source);
    let value: any;
    let label: string = '';
    if (isObject(arg2)) {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            throw new Error(`${source} -> ${vSource} Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (!isNumeric(value, requireInteger, requireNonNegative)) {
        let msg = [`${source} Invalid argument: '${label}'`,
            `Expected '${label}' to be: number or string (numeric string)`,
            ` -- requireInteger ? ${requireInteger}`,
            ` -- requireNonNegative ? ${requireNonNegative}`,
            `Received '${label}' value: ${typeof value} = '${value}'`,
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
}

export function numberArgument(
    source: string,
    labeledNumber: { [label: string]: any },
    requireInteger?: boolean
): void

export function numberArgument(
    source: string,
    label: string,
    value: any,
    requireInteger?: boolean
): void

/**
 * @param source `string` indicating what called `numberArgument()`
 * @param arg2 `string | { [label: string]: any }` the argument/parameter name
 * @param arg3 `any` the value passed into the `source` 
 * for the argument corresponding to `label`
 * @param requireInteger `boolean` `(optional)` `default = false` 
 * - `if` `true`, validates that `value` is an `integer`
 * - `if` `false`, `value` can be a `float`
 * @throws **`Error`** if `value` is not a number or is not an integer (if `requireInteger` is `true`)
 * 
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: number | integer`
 * -  `Received '${label}' value: ${typeof value} = '${value}'`
 */
export function numberArgument(
    source: string,
    arg2: string | { [label: string]: any },
    arg3?: number | boolean | any,
    requireInteger: boolean = false
): void {
    source = bracketed(source);
    const vSource = getSourceString(F, numberArgument.name);
    let label: string = '';
    let value: any = arg3;
    if (isObject(arg2)) {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            throw new Error(`${source} -> ${vSource} Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
        if (typeof arg3 === 'boolean') {
            requireInteger = arg3;
        }
    }
    if (typeof value !== TypeOfEnum.NUMBER || isNaN(value)) {
        let msg = [`${source} Invalid argument: '${label}'`,
            `Expected '${label}' to be: number`,
            `Received '${label}' value: ${typeof value} = '${value}'`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
    if (requireInteger && !Number.isInteger(value)) {
        let msg = [`${source} Invalid argument: '${label}'`,
            `Expected '${label}' to be: integer`,
            `Received '${label}' value: ${typeof value} = '${value}'`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
}

/**
 * @param source `string` indicating what called `booleanArgument()`
 * @param arg2 `string | { [label: string]: any }` the argument/parameter name
 * @param value `any` the value passed into the `source` 
 * for the argument corresponding to `label`
 * 
 * @throws **`Error`** `if` `value` is not a `boolean`
 * 
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: boolean`
 * -  `Received '${label}' value: ${typeof value} = '${value}'`
 */
export function booleanArgument(
    source: string,
    arg2: string | { [label: string]: any },
    value?: any
): void {
    const vSource = getSourceString(F, booleanArgument.name);
    let label: string = '';
    if (isObject(arg2)) {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            throw new Error(`${source} -> ${vSource} Invalid argument: '${JSON.stringify(arg2)}' - expected a single key`);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (typeof value !== TypeOfEnum.BOOLEAN) {
        throw new Error([`${bracketed(source)} Invalid argument: '${label}'`,
            `Expected '${label}' to be: ${TypeOfEnum.BOOLEAN}`,
            `Received '${label}' value: ${typeof value} = '${value}'`
        ].join(TAB));
    }
}

/**
 * @param source `string` indicating what called `functionArgument`
 * @param arg2 `string` the argument/parameter name
 * @param value `any` the value passed into the `source` 
 * for the argument corresponding to `label`
 * 
 * @throws **`Error`** `if` `value` is not a function
 * 
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: function`
 * -  `Received '${label}' value: ${typeof value} = '${value}'`
 */
export function functionArgument(
    source: string,
    arg2: string | { [label: string]: any},
    value?: any
): void {
    const vSource = getSourceString(F, booleanArgument.name);
    source = bracketed(source)
    let label: string = '';
    if (isObject(arg2)) {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            let msg = [`${source} -> ${vSource} Invalid arg2 as labeledFunction`,
                `Expected: object with single key-value pair`,
                `Received: '${JSON.stringify(arg2)}'`,
            ].join(TAB);
            mlog.error(msg);
            throw new Error(msg);
        }
        label = keys[0];
        value = arg2[label];
    }
    if (typeof value !== 'function') {
        let msg = [`${source} Invalid argument: '${label}'`,
            `Expected '${label}' to be: function`,
            `Received '${label}' value: ${typeof value} = '${value}'`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
}

/**
 * @note `if` `elementTypeGuard`'s name or its label includes 'Array' then only check `elementTypeGuard(value)`
 * instead of checking `value.every(el => elementTypeGuard(el))`
 * @param source `string` indicating what called `validateArrayArgument`
 * @param label `string` the argument/parameter name
 * @param value `any` the value passed into the `source` 
 * for the argument corresponding to `label`
 * @param elementType `TypeOfEnum | string` `(optional)`, the expected type of each element in the array
 * - `if` provided, must be one of the values in {@link TypeOfEnum} or a string representing the type
 * @param elementTypeGuard `(value: any) => boolean` `(optional)`, a type guard function that checks if each element in the array is of a specific type
 * - `if` provided, must be a function that takes a value and returns a boolean indicating if the value is of the expected type
 * - `if` both `elementType` and `elementTypeGuard` are provided, both must be satisfied
 * - `if` neither is provided, `validateArrayArgument` will only check if `value` is a non-empty array
 * @param allowEmpty `boolean` `(optional)`, if `true`, allows `value` to be an empty array
 * - `default` is `false`, meaning an empty array will throw an error
 * @throws **`Error`** `if` `value` is not a non-empty array or does not pass the type checks
 * 
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: non-empty array`
 * -  `Received '${label}' value: ${typeof value} = '${value}'`
 */
export function arrayArgument(
    source: string,
    label: string,
    value: any,
    elementType?: TypeOfEnum | string,
    elementTypeGuard?: (value: any) => boolean,
    allowEmpty?: boolean
): void

/**
 * @note `if` `elementTypeGuard`'s name or its label includes 'Array' then only check `elementTypeGuard(value)`
 * instead of checking `value.every(el => elementTypeGuard(el))`
 * @param source `string` indicating what called `validate.arrayArgument`
 * @param labeledArgs ` [label: string]: any | ((value: any) => boolean) }` 
 * @param allowEmpty `boolean` optional, if `true`, allows `value` to be an empty array
 * @throws **`Error`** `if` `value` is not a non-empty array or does not pass the type checks
 * 
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: non-empty array`
 * -  `Received '${label}' value: ${typeof value} = '${value}'`
 * 
 * `if` `elementTypeGuard` is provided:
 * -  `Expected '${label}' to be: non-empty array of ${elementType}`
 * -  `Received '${label}' value: ${JSON.stringify(value)}`
 * -  `Element typeGuard function: ${elementTypeGuard.name}(value: any): value is ${elementType}`
 */
export function arrayArgument(
    source: string,
    labeledArgs: { [label: string]: any | ((value: any) => boolean) },
    allowEmpty?: boolean
): void

/**
 * @note `if` `elementTypeGuard`'s name or its label includes 'Array' then only check `elementTypeGuard(value)`
 * instead of checking `value.every(el => elementTypeGuard(el))`
 * @param source `string` indicating what called `arrayArgument`
 * @param arg2 `label (string) | labeledArgs { [label: string]: any | ((value: any) => boolean) }`
 * @param arg3 `value (any) | allowEmpty (boolean)`
 * @param elementType `string | undefined`
 * @param elementTypeGuard `(value: any) => boolean` `(optional)`, a type guard function that checks if each element in the array is of a specific type
 * - `if` provided, must be a function that takes a value and returns a boolean indicating if the value is of the expected type
 * - `if` both `elementType` and `elementTypeGuard` are provided, both must be satisfied
 * - `if` neither is provided, `validateArrayArgument` will only check if `value` is a non-empty array
 * @param allowEmpty `boolean` `(optional)`, if `true`, allows `value` to be an empty array
 * - `default` is `false`, meaning an empty array will throw an error
 * @note This overload automatically derives the element type name from the type guard function name using regex.
 * For example, if the type guard function is named `isNonEmptyString`, the element type name will be extracted as `NonEmptyString`.
 */
export function arrayArgument(
    source: string,
    /** `label (string) | labeledArgs { [label: string]: any | ((value: any) => boolean) }` */
    arg2: string | { [label: string]: any },
    /** `value (any) | allowEmpty (boolean)` */
    arg3?: any | boolean | undefined,
    /** elementType (TypeOfEnum | string) | undefined */
    elementType?: TypeOfEnum | string | undefined,
    /** elementTypeGuard | allowEmpty (boolean) */
    elementTypeGuard?: ((value: any) => boolean) | undefined,
    allowEmpty?: boolean | undefined
): void {
    const vSource = getSourceString(F, arrayArgument.name);
    source = bracketed(source);
    let label: string = '';
    let value: any = undefined;
    let functionLabel: string | undefined = '';
    if (isNonEmptyString(arg2)) {
        label = arg2;
        value = arg3;
        allowEmpty = allowEmpty ?? false;
    } else if (isObject(arg2)) {
        let keys = Object.keys(arg2);
        if (keys.length === 0 || keys.length > 2 || keys.some(k => !isNonEmptyString(k))) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as labeledArgs`,
                `Expected: object with at most 2 keys:`
                +`{ [arrayLabel: string]: valueToCheck; [typeGuardFunctionName: string]?: typeGuardFunction }`,
                `Received: object with ${keys.length} key(s)`,
                `arg2: ${JSON.stringify(arg2)}`
            ].join(TAB);
            mlog.error(msg);
            throw new Error(msg);
        }
        let variableLabel = Object.keys(arg2)
            .find(key => typeof arg2[key] !== 'function');
        if (!variableLabel) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as labeledArgs`,
                `Expected: object of size 2 with exactly 1 key whose value is a typeGuard function`,
                `Received: Object.values(arg2) = ${JSON.stringify(Object.values(arg2))}`
            ].join(TAB);
            mlog.error(msg);
            throw new Error(msg);
        }
        label = variableLabel;
        value = arg2[variableLabel];
        allowEmpty = arg3 ?? false;
        functionLabel = Object.keys(arg2)
            .find(key => typeof arg2[key] === 'function');
        if (functionLabel) {
            elementTypeGuard = arg2[functionLabel];
            const match = typeGuardNamePattern.exec(label);
            elementType = match ? match[0] : functionLabel;
        }
    } else {
        let msg = [`${source} -> ${vSource} Invalid parameter: 'arg2'`,
            `Expected: label (string) | labeledArgs ({ [label: string]: any | ((value: any) => boolean) })`,
            `Received: ${typeof arg2} = ${arg2}`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
    if (!Array.isArray(value)) {
        let msg = [`${source} Invalid Array Argument: '${label}'`,
            `Expected '${label}' to be: Array`+(elementType ? `<${elementType}>`:''),
            `Received '${label}' value: ${typeof value} = '${value}'`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
    if (!allowEmpty && isEmptyArray(value)) {
        let msg = [`${source} Invalid Array Argument: '${label}'`,
            `Expected '${label}' to be: non-empty Array`+(elementType ? `<${elementType}>`:''),
            `Received '${label}' value: empty array`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    } else if (allowEmpty && isEmptyArray(value)) { 
        return;
    } // else: isNonEmptyArray === true
    
    /**
     * `if` elementTypeGuard's name includes 'Array' then assume that 
     * the typeGuard function handles checking each element of the array,
     * so just pass the array in
     */
    let typeGuardIsForArray = (typeof elementTypeGuard === 'function' 
        && (elementTypeGuard.name.includes('Array') 
            || (isNonEmptyString(functionLabel) 
                && functionLabel.includes('Array')
            )
        )
    );
    if (typeof elementTypeGuard === 'function' && typeGuardIsForArray) {
        let msg = [`${source} Invalid Array Argument: '${label}'`,
            `Expected '${label}' to be: Array`+(elementType ? `<${elementType}>`:'')+
            ` (typeGuard used = '${elementTypeGuard.name}')`,
            `Received '${label}' value: Array with invalid element`,
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    } else if (typeof elementTypeGuard === 'function') { 
        // else assume have to apply elementTypeGuard to each element of array
        for (let i = 0; i < value.length; i++) {
            if (!elementTypeGuard(value[i])) {
                let msg = [`${source} Invalid Array Argument: '${label}'`,
                    `Expected '${label}' to be: Array`+(elementType ? `<${elementType}>`:'')+
                    ` (typeGuard used = '${elementTypeGuard.name}')`,
                    `Received '${label}' value: Array with invalid element at index ${i}`,
                    `array[i]: ${typeof value[i]} = ${JSON.stringify(value[i])}`
                ].join(TAB);
                mlog.error(msg);
                throw new Error(msg);
            }
        }
    }
    return;
}

type ObjectArgumentOptions = { 
    [valueLabel: string]: any
} & {
    [typeGuardLabel: string]: (value: any) => boolean
}

function isObjectArgumentOptions(value: any): value is ObjectArgumentOptions {
    if (!isObject(value)) {
        return false;
    }
    let keys = Object.keys(value);
    const isLabeledValue = (keys.length === 1 
        && typeof keys[0] !== 'function'
    );
    const isLabeledValueWithTypeGuard = (keys.length === 2 
        && keys.some(k => typeof value[k] === 'function')
        && keys.some(k => typeof value[k] !== 'function')
    );
    return (keys.every(k => isNonEmptyString(k)) 
        && (isLabeledValue || isLabeledValueWithTypeGuard)
    );
}

/**
 * - `verbose` overload
 * @note **`allows value to be an array if and only if:`**
 * - `labeledArgs` has a key-value pair where value is objectTypeGuard 
 * and either `value.name.includes('Array')` or `key.includes('Array')` e.g. `isStringArray`
 * @param source `string` indicating what called `objectArgument`
 * @param label `string` the argument/parameter name
 * @param value `any` the value passed into the `source` 
 * for the argument corresponding to `label`
 * @param objectTypeName `string` the expected object type name `default` is `object (Record<string, any>)`
 * @param objectTypeGuard `(value: any) => boolean` optional, a type guard 
 * function that checks if the value is of the expected object type
 * @param allowEmpty `boolean` optional, if `true`, allows `value` to be an empty object `{} or undefined`
 */
export function objectArgument(
    source: string,
    label: string,
    value: any,
    objectTypeName?: string,
    objectTypeGuard?: (value: any) => boolean,
    allowEmpty?: boolean
): void

/**
 * - `concise` overload
 * @note **`allows value to be an array if and only if:`**
 * - `labeledArgs` has a key-value pair where value is objectTypeGuard 
 * and either `value.name.includes('Array')` or `key.includes('Array')` e.g. `isStringArray`
 * @param source `string` indicating what called `objectArgument`
 * @param labeledArgs {@link ObjectArgumentOptions} object containing at most two key-value pairs
 * 1. `label: value`
 * 2. `typeGuardFunctionLabel: typeGuardFunction` `(optional)` 
 * @param allowEmpty `boolean` optional, if `true`, allows `value` to be an empty object `{} or undefined`
 * */
export function objectArgument(
    source: string,
    /** maxLength = 2 */
    labeledArgs: ObjectArgumentOptions | { [label: string]: any | ((value: any) => boolean) },
    allowEmpty?: boolean
): void

/**
 * @note **`allows value to be an array if and only if:`**
 * - `labeledArgs` has a key-value pair where value is objectTypeGuard 
 * and either `value.name.includes('Array')` or `key.includes('Array')` e.g. `isStringArray`
 * **`msg`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected '${label}' to be: non-empty 'object'`
 * -  `Received '${label}' value: ${typeof value} = '${value}'`
 * 
 * `if` `objectTypeGuard` is provided:
 * -  `Expected '${label}' to be: object of type '${objectTypeName}'`
 * -  `Received '${label}' value: ${JSON.stringify(value)}`
 * -  `Element typeGuard function: ${objectTypeGuard.name}(value: any): value is ${objectTypeName}`
 */
export function objectArgument(
    source: string,
    /** `label (string) | labeledArgs ({ [label: string]: any | ((value: any) => boolean) })` */
    arg2: string | ObjectArgumentOptions | { [label: string]: any | ((value: any) => boolean) },
    /** `value (any) | allowEmpty (boolean)` */
    arg3?: any | boolean,
    /** `objectTypeName (string) | allowEmpty (boolean)` */
    objectTypeName?: string | undefined,
    /** `objectTypeGuard | undefined` */
    objectTypeGuard?: ((value: any) => boolean) | undefined,
    /** `allowEmpty (boolean) | undefined` */
    allowEmpty?: boolean | undefined
): void {
    source = bracketed(source);
    const vSource = getSourceString(F, objectArgument.name);
    let label: string = '';
    let functionLabel: string | undefined = '';
    let value: any = undefined;
    if (typeof arg2 === 'string') {
        label = arg2;
        value = arg3;
        allowEmpty = allowEmpty ?? false;
    } else if (isObjectArgumentOptions(arg2)) {
        let keys = Object.keys(arg2);
        functionLabel = keys.find(k => typeof arg2[k] === 'function');
        let variableLabel = keys.find(k => typeof arg2[k] !== 'function');
        if (!variableLabel) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as labeledArgs`,
                `Expected: object with labeledObject entry and optional labledTypeGuard entry`,
                `Received: Object.values(arg2) = ${JSON.stringify(Object.values(arg2))}`
            ].join(TAB);
            mlog.error(msg);
            throw new Error(msg);
        }
        label = variableLabel;
        value = arg2[variableLabel];
        allowEmpty = typeof arg3 === 'boolean' ? arg3 : false;
        if (functionLabel) {
            const match = typeGuardNamePattern.exec(functionLabel);
            objectTypeName = match ? match[0] : functionLabel;
            objectTypeGuard = arg2[functionLabel];
        }
    } else {
        let msg = [`${source} -> ${vSource} Invalid parameter: 'arg2'`,
            `Expected: label (string) | labeledArgs (ObjectArgumentOptions | { [label: string]: any | ((value: any) => boolean) })`,
            `Received: ${typeof arg2} = ${arg2}`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
    objectTypeName = objectTypeName || 'object Record<string, any>';
    if (typeof value !== 'object') {
        let msg = [`${source} Invalid Object Argument: '${label}'`,
            `Expected '${label}' to be: object of type '${objectTypeName}'`,
            `Received '${label}' value: ${typeof value} = '${value}'`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
    if (value === null || value === undefined) {
        let msg = [`${source} Invalid Object Argument: '${label}' is null or undefined`,
            `Expected '${label}' to be: object of type '${objectTypeName}'`,
            `Received '${label}' value: ${value}`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    } 
    let typeGuardIsForArray = (objectTypeGuard 
        && (objectTypeGuard.name.includes('Array')
            || (isNonEmptyString(functionLabel) 
            && functionLabel.includes('Array'))
        )
    );
    if (Array.isArray(value) && !typeGuardIsForArray) {
        let msg = [`${source} Invalid Object Argument: '${label}' is an Array`,
            `Expected '${label}' to be: object of type '${objectTypeName}'`,
            `Received '${label}' value: array of length ${value.length}`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
    if (allowEmpty && Object.keys(value).length === 0) { return }
    if (typeof objectTypeGuard === 'function' && !objectTypeGuard(value)) {
        let msg = [`${source} Invalid Object Argument: '${label}'`,
            `Expected: object of type '${objectTypeName} '`+
            `(typeGuard used = '${objectTypeGuard.name}')`,
            `Received: ${typeof value} = ${JSON.stringify(value, null, 4)}`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
    // reached end -> value is a valid object
    return;
}

type EnumObject = Record<string, string> | Record<string, number>;



function isEnumObject(value: any): value is EnumObject {
    return (isObject(value) 
        && Object.keys(value).length > 0
        && (Object.values(value).every(v => typeof v === 'string')
            || 
            Object.values(value).every(v => typeof v === 'number')
        )
    )
}
function isEnumArgumentOptions(value: any): value is EnumArgumentOptions {
    if (!isObject(value)) {
        return false;
    }
    const keys = Object.keys(value);
    const values = Object.values(value);
    return (keys.length === 2 
        && keys.every(k => isNonEmptyString(k))
        && values.some(v => 
            typeof v === 'number' || typeof v === 'string'
        ) // valueToCheck
        && values.some(v => // isEnumFunction or EnumObject
            typeof v === 'function' || isEnumObject(v)
        ) 
    );
}

/**
 * Object with 2 entries:
 * 1. `valueLabel` mapped to `valueToCheck`
 * 2. **One of:**
 * - `enumLabel` mapped to {@link EnumObject} // let `enumArgument()` check if valid enum value
 * - `isEnumFunctionLabel:` `isEnumFunction` // use `isEnumFunction` to check if valid enum value
 */
type EnumArgumentOptions = { 
    [valueLabel: string]: any
} & ({
    [validationEntryLabel: string]: EnumObject | ((value: any) => boolean)
})
// | {
//     [isEnumFunctionLabel: string]: 
// })

export function enumArgument(
    source: string,
    label: string,
    value: any,
    enumLabel: string,
    enumObject: EnumObject, // @TODO maybe implement overload arg5: EnumObject | ((value: any) => boolean)
): string | number

/**
 * @param source `string` indicating what called `enumArgument()`
 * @param labeledArgs {@link EnumArgumentOptions} 
 * = `{ [valueLabel: string]: valueToCheck } & ({ isEnumFunction } | { EnumObject })`
 */
export function enumArgument(
    source: string,
    labeledArgs: EnumArgumentOptions,
): string | number

/**
 * @param source `string` indicating what called `enumArgument()`
 * @param arg2 `string | `{@link EnumArgumentOptions} 
 * = `{ [valueLabel: string]: valueToCheck } & ({ isEnumFunction } | { EnumObject })`
 * @returns {string | number} the validated enum value
 * @throws **`Error`** if `value` is not a valid enum value
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
export function enumArgument(
    source: string,
    arg2: string | EnumArgumentOptions,
    value?: any | undefined,
    enumLabel?: string | undefined,
    enumObject?: EnumObject | undefined,
): string | number {
    source = bracketed(source);
    const vSource = getSourceString(F, enumArgument.name);
    let valueLabel: string | undefined = undefined;
    let valueToCheck: any;
    if (isNonEmptyString(arg2)) {
        valueLabel = arg2;
        valueToCheck = value;
    } else if (isEnumArgumentOptions(arg2)) {
        const keys = Object.keys(arg2);
        valueLabel = keys.find(key => 
            typeof arg2[key] === 'number' || typeof arg2[key] === 'string'
        );
        if (!valueLabel) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as EnumArgumentOptions`,
                `EnumArgumentOptions does not contain a value comparable to values of an EnumObject`,
                `Expected arg2 to have single entry of format [valueLabel: string]: (string | number)`
            ].join(TAB);
            mlog.error(msg);
            throw new Error(msg);
        }
        valueToCheck = arg2[valueLabel];
        let functionKey = Object.keys(arg2)
            .find(k=>typeof arg2[k] === 'function');
        if (functionKey) {
            enumLabel = functionKey.startsWith('is') ?
                functionKey.slice(2) : '';
            let isEnumFunction = arg2[functionKey] as (value: any) => boolean;
            if (!isEnumFunction(valueToCheck)) {
                let msg = [`${source} Invalid enum value Argument: '${valueLabel}'`,
                    `Expected '${valueLabel}' to be: `+(isNonEmptyString(enumLabel) ? enumLabel : `value satisfying ${functionKey}`),
                    `Received '${valueLabel}' value: ${typeof valueToCheck} = '${valueToCheck}'`,
                ].join(TAB);
                mlog.error(msg);
                throw new Error(msg);
            } else { // isEnumFunction(valueToCheck) === true
                return valueToCheck;
            }
        }
        enumLabel = keys
            .filter(key => key !== valueLabel)
            .find(key => isEnumObject(arg2[key]));
        if (!enumLabel) {
            let msg = [`${source} -> ${vSource} Invalid parameter: arg2 as EnumArgumentOptions`,
                `EnumArgumentOptions does not contain an entry with a value that is an EnumObject or isEnumFunction`,
                `Expected arg2 to have single entry of format [label: string]: EnumObject | Function`
            ].join(TAB);
            mlog.error(msg);
            throw new Error(msg);
        }
        enumObject = arg2[enumLabel] as EnumObject;
    } else {
        let msg =[`${source} -> ${vSource} Invalid parameter 'arg2'`,
            `Expected 'arg2' to be either label (string) | labeledArgs (EnumArgumentOptions)`,
            `Received ${typeof arg2} = ${arg2}`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
    if (!isEnumObject(enumObject)) {
        let msg = [`${source} -> ${vSource}.verbose: Invalid EnumObject for '${enumLabel}'`,
            `Expected non-empty object Record<string, number> | Record<string, string>`,
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
    const enumKeys = Object.keys(enumObject);
    const enumValues = Object.values(enumObject);
    const isStringEnum = enumValues.every(val => typeof val === 'string');
    const isNumberEnum = enumValues.every(val => typeof val === 'number');
    let matchedValue: string | number | undefined;
    if (isStringEnum) {
        // For string enums, check both keys and values with case-insensitive matching
        if (typeof valueToCheck === 'string') {
            const lowerValueToCheck = valueToCheck.toLowerCase();
            
            // Check if it matches a key (case-insensitive)
            const matchingKey = enumKeys.find(key => key.toLowerCase() === lowerValueToCheck);
            if (matchingKey) {
                matchedValue = enumObject[matchingKey] as string;
            } else { // Check if it matches a value (case-insensitive)
                const matchingValue = enumValues.find(val => 
                    typeof val === 'string' && val.toLowerCase() === lowerValueToCheck
                );
                if (matchingValue) {
                    matchedValue = matchingValue as string;
                }
            }
        } else { // For non-string input, only check exact value match
            if (enumValues.includes(valueToCheck)) {
                matchedValue = valueToCheck as string;
            }
        }
    } else if (isNumberEnum) {
        // For number enums, check if value is a number or string key
        if (typeof valueToCheck === 'number' && enumValues.includes(valueToCheck)) {
            matchedValue = valueToCheck;
        } else if (typeof valueToCheck === 'string') {
            // Check if string matches a key (case-sensitive for number enums)
            if (enumKeys.includes(valueToCheck)) {
                matchedValue = enumObject[valueToCheck] as number;
            }
        }
    }

    if (matchedValue === undefined) {
        let msg = [`${source} Invalid argument: '${valueLabel}'`,
            `Expected '${valueLabel}' to be: valid ${enumLabel} enum ${isStringEnum 
                ? 'key (string) or value (string)' : 'key (string) or value (number)'
            }`,
            `Received '${valueLabel}' value: ${valueToCheck} (${typeof valueToCheck})`,
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
    return matchedValue;
}



/** use existingFileArgument() or existingDirectoryArgument() */
export function existingPathArgument(
    source: string,
    arg2: string | { [label: string]: any },
    value?: any,
    extension?: string
): void {
    const vSource = getSourceString(F, existingPathArgument.name);
    source = bracketed(source)
    let label: string = '';
    if (isObject(arg2)) {
        const keys = Object.keys(arg2);
        if (keys.length !== 1) {
            let msg = [`${source} -> ${vSource} Invalid argument: '${JSON.stringify(arg2)}'`,
                `Expected: object with a single key`,
                `Received: ${keys.length}`
            ].join(TAB);
            mlog.error(msg);
            throw new Error(msg);
        }
        label = keys[0];
        value = arg2[label];
    }
    let hasExpectedExtension = Boolean(!extension || (isNonEmptyString(extension) 
        && value.toLowerCase().endsWith(extension.toLowerCase())
    ));
    if (!isNonEmptyString(value) || !hasExpectedExtension || !fs.existsSync(value)) {
        let msg = [`${source} Invalid argument: '${label}'`,
            `Expected '${label}' to be: existing path` 
            + (isNonEmptyString(extension) ? ` with extension '${extension}'` : ``),
            `Received '${label}' value: ${typeof value} = '${value}'`
        ].join(TAB);
        mlog.error(msg);
        throw new Error(msg);
    }
}

// function logAndThrow(errorMsg: string): void {
//     mlog.error(errorMsg);
//     throw new Error(errorMsg);
// }

// ============================================================================
// Local Utility Functions
// ============================================================================

/**
 * @description surrounds `s` with brackets if it doesn't already have them
 * @param s `string`
 * @returns **`bracketedString`** `string`
 */
export const bracketed = (s: string): string => {
    if (!isNonEmptyString(s)) s = 'argumentValidation'
    s = s.trim();
    const alreadyHasBrackets = /^\[.*\]$/.test(s);
    if (!alreadyHasBrackets) {
        s = `[${s}()]`
    }
    return s;
}

function isDirectory(value: any): value is string {
    return (isNonEmptyString(value) 
        && fs.existsSync(value) 
        && fs.statSync(value).isDirectory()
    );
}

function isFile(value: string): value is string {
    return (isNonEmptyString(value) 
        && fs.existsSync(value) 
        && fs.statSync(value).isFile()
    );
}

/**
 * local copy of func from `io/logging.ts`
 * @param fileName `string` 
 * @param func `Function` - to get Function.name
 * @param funcInfo `any` `(optional)` - context or params of func (converted to string)
 * @param startLine `number` `(optional)`
 * @param endLine `number` `(optional)`
 * @returns **`sourceString`** `string` to use in log statements or argumentValidation calls
 */
function getSourceString(
    fileName: string, 
    func: string | Function, 
    funcInfo?: any, 
    startLine?: number, 
    endLine?: number
): string {
    let lineNumberText = (isInteger(startLine) 
        ? `:${startLine}` 
        : ''
    );
    lineNumberText = (isNonEmptyString(lineNumberText) 
        && isInteger(endLine) 
        ? lineNumberText + `-${endLine}`
        : ''
    ); 
    let funcName = typeof func === 'string' ? func : func.name
    return `[${fileName}.${funcName}(${isNonEmptyString(funcInfo) ? ` ${funcInfo} `: ''})${lineNumberText}]`;
}