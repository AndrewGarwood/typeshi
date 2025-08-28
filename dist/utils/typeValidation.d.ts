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
 * @returns **`isIntegerArray`** `boolean` = `value is Array<number> & { length: number }`
 * - **`true`** if `value` is an array with `length > 0` and each of its elements is an `integer`
 * - **`false`** `otherwise`
 */
export declare function isIntegerArray(value: any, requireNonNegative?: boolean): value is Array<number> & {
    length: number;
};
/**
 * @consideration add param to allow for empty strings?
 * @param value `any`
 * @returns **`isStringArray`** `boolean` = `value is Array<string> & { length: number }`
 * - **`true`** if `value` is an array with `length > 0` and each of its elements is a **non-empty** `string`
 * - **`false`** `otherwise`
 */
export declare function isStringArray(value: any): value is Array<string> & {
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
 * @TODO maybe should do like charArray.every(char=>isInteger)
 * - and maybe add `requireInteger` param so know whether or not to accept decimal stuff
 * @param value
 * @returns **`isNumericString`** `boolean`
 */
export declare function isNumericString(value: any): boolean;
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
/**
 * @TODO deprecate and remove this
 * @enum {string} **`TypeOfEnum`**
 * @property **`STRING`** = `'string'`
 * @property **`NUMBER`** = `'number'`
 * @property **`BOOLEAN`** = `'boolean'`
 * @property **`OBJECT`** = `'object'`
 * @property **`FUNCTION`** = `'function'`
 */
export declare enum TypeOfEnum {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
    OBJECT = "object",
    FUNCTION = "function"
}
