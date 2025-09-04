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
import { TypeOfEnum } from "./typeValidation";
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
export declare function stringArgument(source: string, arg2: string | {
    [label: string]: any;
}, value?: any): void;
/**
 * @param source `string`
 * @param labeledStrings `Record<string, any>` - map name of string param to value passed in for it
 */
export declare function multipleStringArguments(source: string, labeledStrings: Record<string, any>): void;
export declare function multipleExistingFileArguments(source: string, extension: string | string[], labeledFilePaths: Record<string, string>): void;
export declare function existingFileArgument(source: string, extension: string | string[], arg3: string | {
    [label: string]: any;
}, value?: any): void;
export declare function existingDirectoryArgument(source: string, arg2: string | {
    [label: string]: any;
}, value?: any): void;
/**
 * - uses `isNumeric(value): value is string | number`
 * - to check whether `value` is either a `number` or a `string` that can be casted to a `number`
 * @param source `string`
 * @param arg2 `string | { [label: string]: any }`
 * @param requireInteger `boolean (optional)` `default` = `false` (argument passed into `isNumeric`)
 * @param requireNonNegative `boolean (optional)` `default` = `false` (argument passed into `isNumeric`)
 */
export declare function numericStringArgument(source: string, arg2: string | {
    [label: string]: any;
}, requireInteger?: boolean, requireNonNegative?: boolean): void;
export declare function numberArgument(source: string, labeledNumber: {
    [label: string]: any;
}, requireInteger?: boolean): void;
export declare function numberArgument(source: string, label: string, value: any, requireInteger?: boolean): void;
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
export declare function booleanArgument(source: string, arg2: string | {
    [label: string]: any;
}, value?: any): void;
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
export declare function functionArgument(source: string, arg2: string | {
    [label: string]: any;
}, value?: any): void;
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
export declare function arrayArgument(source: string, label: string, value: any, elementType?: TypeOfEnum | string, elementTypeGuard?: (value: any) => boolean, allowEmpty?: boolean): void;
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
export declare function arrayArgument(source: string, labeledArgs: {
    [label: string]: any | ((value: any) => boolean);
}, allowEmpty?: boolean): void;
type ObjectArgumentOptions = {
    [valueLabel: string]: any;
} & {
    [typeGuardLabel: string]: (value: any) => boolean;
};
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
export declare function objectArgument(source: string, label: string, value: any, objectTypeName?: string, objectTypeGuard?: (value: any) => boolean, allowEmpty?: boolean): void;
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
export declare function objectArgument(source: string, 
/** maxLength = 2 */
labeledArgs: ObjectArgumentOptions | {
    [label: string]: any | ((value: any) => boolean);
}, allowEmpty?: boolean): void;
type EnumObject = Record<string, string> | Record<string, number>;
/**
 * Object with 2 entries:
 * 1. `valueLabel` mapped to `valueToCheck`
 * 2. **One of:**
 * - `enumLabel` mapped to {@link EnumObject} // let `enumArgument()` check if valid enum value
 * - `isEnumFunctionLabel:` `isEnumFunction` // use `isEnumFunction` to check if valid enum value
 */
type EnumArgumentOptions = {
    [entryLabel: string]: any | EnumObject | ((value: any) => boolean);
};
export declare function enumArgument(source: string, label: string, value: any, enumLabel: string, enumObject: EnumObject): string | number;
/**
 * @param source `string` indicating what called `enumArgument()`
 * @param labeledArgs {@link EnumArgumentOptions}
 * = `{ [valueLabel: string]: valueToCheck } & ({ isEnumFunction } | { EnumObject })`
 */
export declare function enumArgument(source: string, labeledArgs: EnumArgumentOptions): string | number;
/** use existingFileArgument() or existingDirectoryArgument() */
export declare function existingPathArgument(source: string, arg2: string | {
    [label: string]: any;
}, value?: any, extension?: string): void;
/**
 * @description surrounds `s` with brackets if it doesn't already have them
 * @param s `string`
 * @returns **`bracketedString`** `string`
 */
export declare const bracketed: (s: string) => string;
export {};
