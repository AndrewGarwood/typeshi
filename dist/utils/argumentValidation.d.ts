/**
 * @file src/utils/argumentValidation.ts
 * @description moved the content of parameter type checks at the start of
 * functions to here. use these when you want your function to throw a fit when
 * it receives bad input.
 */
import { TypeOfEnum } from "./typeValidation";
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
export declare function isDirectory(pathString: string): boolean;
export declare function isFile(pathString: string): boolean;
export declare function numericStringArgument(source: string, arg2: string | {
    [label: string]: any;
}, value?: any): void;
export declare function numberArgument(source: string, labeledNumber: {
    [label: string]: any;
}, requireInteger?: boolean): void;
export declare function numberArgument(source: string, label: string, value: any, requireInteger?: boolean): void;
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
export declare function booleanArgument(source: string, arg2: string | {
    [label: string]: any;
}, value?: any): void;
/**
 * @param source `string` indicating what called `validateArrayArgument`
 * @param label `string` the argument/parameter name
 * @param value `any` the value passed into the `source`
 * for the argument corresponding to `label`
 * @param elementType `TypeOfEnum | string` optional, the expected type of each element in the array
 * - `if` provided, must be one of the values in {@link TypeOfEnum} or a string representing the type
 * @param elementTypeGuard `(value: any) => boolean` optional, a type guard function that checks if each element in the array is of a specific type
 * - `if` provided, must be a function that takes a value and returns a boolean indicating if the value is of the expected type
 * - `if` both `elementType` and `elementTypeGuard` are provided, both must be satisfied
 * - `if` neither is provided, `validateArrayArgument` will only check if `value` is a non-empty array
 * @param allowEmpty `boolean` optional, if `true`, allows `value` to be an empty array
 * - `default` is `false`, meaning an empty array will throw an error
 * @throws {Error} `if` `value` is not a non-empty array or does not pass the type checks
 *
 * **`message`**: `[source()] Invalid argument: '${label}'`
 * -  `Expected ${label} to be: non-empty array`
 * -  `Received ${label} value: ${typeof value}`
 */
export declare function arrayArgument(source: string, label: string, value?: any, elementType?: TypeOfEnum | string, elementTypeGuard?: (value: any) => boolean, allowEmpty?: boolean): void;
/**
 * @param source `string` indicating what called `validateArrayArgument`
 * @param labeledArray `{ [label: string]: any }` a single object dict mapping label to value
 * @param elementType `TypeOfEnum | string` optional, the expected type of each element in the array
 * @param elementTypeGuard `(value: any) => boolean` optional, a type guard function
 * @param allowEmpty `boolean` optional, if `true`, allows `value` to be an empty array
 * - `default` is `false`, meaning an empty array will throw an error
 * @throws {Error} `if` `value` is not a non-empty array or does not pass the type checks
 */
export declare function arrayArgument(source: string, labeledArray: {
    [label: string]: any;
}, elementType?: TypeOfEnum | string, elementTypeGuard?: (value: any) => boolean, allowEmpty?: boolean): void;
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
export declare function functionArgument(source: string, arg2: string | {
    [label: string]: any;
}, value?: any): void;
/**
 * @param source `string` indicating what called `validateObjectArgument`
 * @param label `string` the argument/parameter name
 * @param value `any` the value passed into the `source`
 * for the argument corresponding to `label`
 * @param objectTypeName `string` the expected object type name `default` is `object (Record<string, any>)`
 * @param objectTypeGuard `(value: any) => boolean` optional, a type guard
 * function that checks if the value is of the expected object type
 * @param allowEmpty `boolean` optional, if `true`, allows `value` to be an empty object `{} or undefined`
 */
export declare function objectArgument(source: string, label: string, value?: any, objectTypeName?: string, objectTypeGuard?: (value: any) => boolean, allowEmpty?: boolean): void;
/**
 * @param source `string` indicating what called `validateObjectArgument`
 * @param labeledObject `{ [label: string]: any }` a single object dict mapping label to value
 * @param objectTypeName `string` the expected object type name
 * @param objectTypeGuard `(value: any) => boolean` optional, a type guard function
 * @param allowEmpty `boolean` optional, if `true`, allows `value` to be an empty object `{} or undefined`
 */
export declare function objectArgument(source: string, labeledObject: {
    [label: string]: any;
}, objectTypeName?: string, objectTypeGuard?: (value: any) => boolean, allowEmpty?: boolean): void;
/**
 * @param source `string` indicating what called `validateObjectArgument`
 * @param labeledValue `{ [label: string]: any }` a single object dict mapping label to value
 * @param labeledTypeGuard `{ [functionName: string]: (value: any) => boolean }` a single object dict mapping type guard function name to the function
 * @param allowEmpty `boolean` optional, if `true`, allows `value` to be an empty object `{} or undefined`
 * @description This overload automatically derives the object type name from the type guard function name using regex.
 * For example, if the type guard function is named `isRecordOptions`, the object type name will be extracted as `RecordOptions`.
 */
export declare function objectArgument(source: string, labeledValue: {
    [label: string]: any;
}, labeledTypeGuard: {
    [functionName: string]: (value: any) => boolean;
}, allowEmpty?: boolean): void;
export declare function enumArgument(source: string, enumLabel: string, enumObject: Record<string, string> | Record<string, number>, label: string, value: any): string | number;
export declare function enumArgument(source: string, 
/**
 * @key the name of the enumObject
 * @value the enumObject itself
 * */
labeledEnumObject: {
    [enumLabel: string]: Record<string, string> | Record<string, number>;
}, 
/**
 * @key the name/lagel of the argument whose value should be typeof enumObject,
 * @value the value to check
 * */
labeledValue: {
    [label: string]: any;
}): string | number;
/**
 * @description surrounds `s` with brackets if it doesn't already have them
 * @param s `string`
 * @returns **`bracketedString`** `string`
 */
export declare const bracketed: (s: string) => string;
/** use existingFileArgument() or existingDirectoryArgument() */
export declare function existingPathArgument(source: string, arg2: string | {
    [label: string]: any;
}, value?: any, extension?: string): void;
