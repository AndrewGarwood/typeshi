/**
 * @file src/utils/typeValidation.ts
 */
/**
 * - alias for {@link isNullLike}
 * ... maybe should just change name of isNullLike but that might break things...
 * @param value `any` the value to check
 * @returns **`isNullLike`** `boolean` = `value is '' | (Array<any> & { length: 0 }) | null | undefined | Record<string, never>`
 * - **`true`** `if` the `value` is null, undefined, empty object (no keys), empty array, or empty string
 * - **`false`** `otherwise`
 */
export declare const isEmpty: typeof isNullLike;
/**
 * @param value `any` the value to check
 * @returns **`isNullLike`** `boolean` = `value is '' | (Array<any> & { length: 0 }) | null | undefined | Record<string, never>`
 * - **`true`** `if` the `value` is null, undefined, empty object (no keys), empty array, or empty string
 * - **`false`** `otherwise`
 */
export declare function isNullLike(value: any): value is '' | null | undefined | (Array<any> & {
    length: 0;
}) | Record<string, never>;
/**
 * @deprecated no type predicate b/c "A type predicate cannot reference a rest parameter.ts(1229)"
 * @param values `any[]`
 * @returns `values.some(v => `{@link isNullLike}`(v))`
 * - **`true`** `if` any of the values are null, undefined, empty object (no keys), empty array, or empty string
 * - **`false`** `otherwise`.
 */
export declare function anyNull(...values: any[]): boolean;
/**
 * @param value
 * @returns **`isNonEmptyArray`** `boolean` = `value is Array<any> & { length: number }`
 * - **`true`** if `value` is an array and has at least one element,
 * - **`false`** otherwise.
 */
export declare function isNonEmptyArray(value: any): value is Array<any> & {
    length: number;
};
/**
 * @param value `any`
 * @returns **`isEmptyArray`** `boolean` = `value is Array<any> & { length: 0 }`
 * - **`true`** if `value` is an array and has no elements,
 * - **`false`** `otherwise`
 */
export declare function isEmptyArray(value: any): value is Array<any> & {
    length: 0;
};
/**
 * @param value `any`
 * @param requireNonNegative `boolean` `default = false`
 * @param requireNonEmpty `boolean` `default = true`
 * - `if` `true` then `value` must be array with at least 1 element
 * - `if` `false` then `value` can be empty array
 * @returns **`isIntegerArray`** `boolean` = `value is Array<number> & { length: number }`
 */
export declare function isIntegerArray(value: any, requireNonNegative?: boolean, requireNonEmpty?: boolean): value is Array<number> & {
    length: number;
};
/**
 * @consideration add param to allow for empty strings?
 * @param value `any`
 * @param requireNonEmpty `boolean` `default = true`
 * - `if` `true` then `value` must be array with at least 1 element
 * - `if` `false` then `value` can be empty array
 * @returns **`isStringArray`** `boolean` = `value is Array<string> & { length: number }`
 */
export declare function isStringArray(value: any, requireNonEmpty?: boolean): value is Array<string> & {
    length: number;
};
/**
 * @note **passing in an array will return `false`.**
 * @note a value is considered trivial if {@link isNullLike}`(value)` returns `true` and vice versa
 * @param obj `any` The object to check.
 * @param requireAll `boolean` - flag indicating whether all values must be nontrivial or not
 * @returns **`hasNonTrivialKeys`** `boolean`
 * - **`true`** `if` the `obj` has non-empty keys,
 * - **`false`** `otherwise`
 */
export declare function hasNonTrivialKeys(obj: any, requireAll?: boolean): obj is Record<string, any>;
/**
 * @TODO add overload on param `keys` where keys = `{ required: string[], optional: string[] }`
 * @note uses `key in obj` for each element of param `keys`
 * @param obj `T extends Object` the object to check
 * @param keys `Array<keyof T> | string[] | string` the list of keys that obj must have
 * @param requireAll `boolean` defaults to `true`
 * - `if` `true`, all keys must be present in the object;
 * - `if` `false`, at least one key must be present
 * @param restrictKeys `boolean` defaults to `false`
 * - `if` `true`, only the keys provided in the `keys` param are allowed in the object;
 * - `if` `false`, the object can keys not included in the `keys` param.
 * @returns **`hasKeys`** `boolean`
 * - **`true`** `if` `obj` is of type 'object' and has the required key(s),
 * - **`false`** `otherwise`
 */
export declare function hasKeys<T extends object>(obj: T, keys: Array<keyof T> | string[] | string, requireAll?: boolean, restrictKeys?: boolean): boolean;
/**
 * @param objA `Record<string, any>`
 * @param objB `Record<string, any>`
 * @returns **`areEquivalentObjects`** `boolean`
 * - `true` `if` `objA` and `objB` are equivalent objects (same keys and values, including nested objects and arrays),
 * - `false` `otherwise`.
 */
export declare function areEquivalentObjects(objA: Record<string, any>, objB: Record<string, any>): boolean;
/**
 * @param value `any`
 * @param requireInteger `boolean` `default = false`
 * @param requireNonNegative `boolean` `default = false`
 * @returns **`isNumeric`** `value is string | number`
 * - **`true`** `if` `value` is either a `number` or a `string` that can be casted to a `number`
 * while also meeting the boolean parameter requirements
 * - **`false`** `otherwise`
 */
export declare function isNumeric(value: any, requireInteger?: boolean, requireNonNegative?: boolean): value is string | number;
/**
 * @param value `any`
 * @returns **`isNonEmptyString`** `boolean`
 * - `true` `if` `value` is a non-empty string (not just whitespace),
 * - `false` `otherwise`.
 */
export declare function isNonEmptyString(value: any): value is string & {
    length: number;
};
export declare function isPrimitiveValue(value: any): value is string | number | boolean | null | undefined;
/**
 * @param value `any`
 * @param requireNonNegative `boolean`
 * - `if` `true` then require that `value` be an integer `>= 0`
 * - `if` `false` then the sign of the number doesn't matter
 * @returns **`isInteger`** `boolean`
 */
export declare function isInteger(value: any, requireNonNegative?: boolean): value is number;
/**
 * @param value `any`
 * @param requireNonEmpty `boolean` `default = true`
 * - `if` `true` then `value` must have at least 1 key
 * - `if` `false` then `value` is allowed to be an empty object
 * @param requireNonArray `boolean` `default = true`
 * - `if` `true` then `value` must not be an array
 * - `if` `false` then `value` is allowed to be an array
 * @returns **`isObject`** `boolean` `value is Record<string, any>`
 */
export declare function isObject(value: any, requireNonEmpty?: boolean, requireNonArray?: boolean): value is Record<string, any>;
export declare function isPositveInteger(value: any): value is number;
export declare const isType: <T>(value: any, guard: (v: any, ...args: any[]) => v is T, ...args: any[]) => value is T;
/**
 * - calls {@link isUndefinedOrNull}`(value)` which allows for value to be `undefined` or `null`
 * - use {@link isUndefinedOr} if you want value is `T | undefined`
 */
export declare class isOptional {
    static type: <T>(value: any, guard: (v: any, ...args: any[]) => v is T, ...args: any[]) => value is T | undefined | null;
    /**
     * @param value
     * @param requireNonEmpty `boolean` `default` = `true` (if `true`, require that string have at least 1 non-whitespace character)
     * @returns
     */
    static string: (value: any, requireNonEmpty?: boolean) => value is string | undefined | null;
    /**
     * @param value
     * @param requireNonEmpty `boolean` `default` = `true` (if `true`, require that array have at least 1 element)
     * @returns
     */
    static stringArray: (value: any, requireNonEmpty?: boolean) => value is string[] | undefined | null;
    static numeric: (value: any, requireInteger?: boolean, requireNonNegative?: boolean) => value is string | number | undefined | null;
    static number: (value: any, requireInteger?: boolean, requireNonNegative?: boolean) => value is number | undefined | null;
    static positiveInteger: (value: any) => value is number | undefined | null;
    static integerArray: (value: any, requireNonNegative?: boolean, requireNonEmpty?: boolean) => value is number[] | undefined | null;
    static boolean: (value: any) => value is boolean | undefined | null;
    static function: (value: any) => value is Function | undefined | null;
}
export declare class isUndefinedOr {
    static type: <T>(value: any, guard: (v: any, ...args: any[]) => v is T, ...args: any[]) => value is T | undefined;
    /**
     * @param value
     * @param requireNonEmpty `boolean` `default` = `true` (if `true`, require that string have at least 1 non-whitespace character)
     * @returns
     */
    static string: (value: any, requireNonEmpty?: boolean) => value is string | undefined;
    /**
     * @param value
     * @param requireNonEmpty `boolean` `default` = `true` (if `true`, require that array have at least 1 element)
     * @returns
     */
    static stringArray: (value: any, requireNonEmpty?: boolean) => value is string[] | undefined;
    static numeric: (value: any, requireInteger?: boolean, requireNonNegative?: boolean) => value is string | number | undefined;
    static number: (value: any, requireInteger?: boolean, requireNonNegative?: boolean) => value is number | undefined;
    static positiveInteger: (value: any) => value is number | undefined;
    static integerArray: (value: any, requireNonNegative?: boolean, requireNonEmpty?: boolean) => value is number[] | undefined;
    static boolean: (value: any) => value is boolean | undefined;
    static function: (value: any) => value is Function | undefined;
}
/**
 * these may be unnecessary, but added for completeness
 */
/**
 * @param value `any`
 * @returns **`isBoolean`** `boolean`
 */
export declare function isBoolean(value: any): value is boolean;
/**
 * @param value `any`
 * @returns **`isFunction`** `boolean`
 */
export declare function isFunction(value: any): value is Function;
/**
 * - passing in `null` returns `false`
 * @param value `any`
 * @returns **`isUndefined`** `boolean` `return value === undefined`
 */
export declare function isUndefined(value: any): value is undefined;
export declare function isUndefinedOrNull(value: unknown): value is undefined | null;
/** key of `T` whose value is a `number` or `undefined`  */
export type NumberKeys<T> = {
    [K in keyof T]: T[K] extends number | undefined ? K : never;
}[keyof T][];
/** key of `T` whose value is an `array` or `undefined`  */
export type ArrayKeys<T> = {
    [K in keyof T]: T[K] extends Array<any> | undefined ? K : never;
}[keyof T][];
export type ArrayOfTypeKeys<T, U> = {
    [K in keyof T]: T[K] extends Array<U> | undefined ? K : never;
}[keyof T][];
/** key of `T` whose value is a `string` or `undefined`  */
export type StringKeys<T> = {
    [K in keyof T]: T[K] extends string | undefined ? K : never;
}[keyof T][];
/** key of `T` whose value is a `primitive` or `undefined`  */
export type PrimitiveKeys<T> = {
    [K in keyof T]: T[K] extends string | number | boolean | null | undefined ? K : never;
}[keyof T][];
export type Primitive = string | number | boolean | null | undefined;
/** Get the union of all values of `T` (like `valueof T`) */
export type ValueOf<T> = T[keyof T];
/** Keys of `T` whose values extend a given type `U` */
export type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T][];
