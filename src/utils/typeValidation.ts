/**
 * @file src/utils/typeValidation.ts
 */

import { equivalentAlphanumericStrings } from "./regex/index";

/**
 * @param value `any` the value to check
 * @returns **`isNullLike`** `boolean` = `value is '' | (Array<any> & { length: 0 }) | null | undefined | Record<string, never>`
 * - **`true`** `if` the `value` is null, undefined, empty object (no keys), empty array, or empty string
 * - **`false`** `otherwise`
 */
export function isNullLike(
    value: any
): value is '' | null | undefined | (Array<any> & { length: 0 }) | Record<string, never> {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'boolean' || typeof value === 'number') {
        return false;
    }
    // Check for empty object or array
    if (typeof value === 'object' && isEmptyArray(Object.keys(value))) {
        return true;
    }
    const isNullLikeString = (typeof value === 'string' 
        && (value.trim() === '' 
            || value.toLowerCase() === 'undefined' 
            || value.toLowerCase() === 'null'
        )
    ); 
    if (isNullLikeString) {
        return true;
    }
    return false;
}
/**
 * @deprecated no type predicate b/c "A type predicate cannot reference a rest parameter.ts(1229)" 
 * @param values `any[]`
 * @returns `values.some(v => `{@link isNullLike}`(v))`
 * - **`true`** `if` any of the values are null, undefined, empty object (no keys), empty array, or empty string
 * - **`false`** `otherwise`.
 */
export function anyNull(...values: any[]): boolean {
    if (values === null || values === undefined) {
        return true;
    }
    return values.some(v => isNullLike(v));
}

/**
 * @param value 
 * @returns **`isNonEmptyArray`** `boolean` = `value is Array<any> & { length: number }`
 * - **`true`** if `value` is an array and has at least one element, 
 * - **`false`** otherwise.
 */
export function isNonEmptyArray(value: any): value is Array<any> & { length: number } {
    return Array.isArray(value) && value.length > 0;
}
/**
 * @param value `any`
 * @returns **`isEmptyArray`** `boolean` = `value is Array<any> & { length: 0 }`
 * - **`true`** if `value` is an array and has no elements,
 * - **`false`** `otherwise`
 */
export function isEmptyArray(value: any): value is Array<any> & { length: 0 } {
    return Array.isArray(value) && value.length === 0; 
}

/**
 * @param value `any`
 * @returns **`isIntegerArray`** `boolean` = `value is Array<number> & { length: number }`
 * - **`true`** if `value` is an array with `length > 0` and each of its elements is an `integer`
 * - **`false`** `otherwise`
 */
export function isIntegerArray(
    value: any, 
    requireNonNegative: boolean = false
): value is Array<number> & { length: number } {
    return (value 
        && isNonEmptyArray(value) 
        && value.every(arrElement => isInteger(arrElement, requireNonNegative)
    ))
}


/**
 * @consideration add param to allow for empty strings?
 * @param value `any`
 * @returns **`isStringArray`** `boolean` = `value is Array<string> & { length: number }`
 * - **`true`** if `value` is an array with `length > 0` and each of its elements is a **non-empty** `string`
 * - **`false`** `otherwise`
 */
export function isStringArray(
    value: any
): value is Array<string> & { length: number } {
    return (isNonEmptyArray(value) 
        && value.every(el => isNonEmptyString(el))
    );
}

/**
 * @note **passing in an array will return `false`.**
 * @note a value is considered trivial if {@link isNullLike}`(value)` returns `true` and vice versa
 * @param obj `any` The object to check.
 * @param requireAll `boolean` - flag indicating whether all values must be nontrivial or not
 * @returns **`hasNonTrivialKeys`** `boolean`
 * - **`true`** `if` the `obj` has non-empty keys, 
 * - **`false`** `otherwise`
 */
export function hasNonTrivialKeys(
    obj: any,
    requireAll: boolean = false
): obj is Record<string, any> {
    if (!isObject(obj)) { return false }
    return (requireAll 
        ? Object.values(obj).every(v=>!isNullLike(v)) 
        : Object.values(obj).some(v=>!isNullLike(v))
    );
}
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
export function hasKeys<T extends object>(
    obj: T, 
    keys: Array<keyof T> | string[] | string, 
    requireAll: boolean = true,
    restrictKeys: boolean = false
): boolean { // obj is object & Record<keyof T | string, any>
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    if (keys === null || keys === undefined) {
        throw new Error('[hasKeys()] no keys provided: param `keys` must be defined');
    }
    if (!isNonEmptyArray(keys)) {
        keys = [keys] as Array<keyof T>; // Convert string (assumed to be single key) to array of keys
    }
    let numKeysFound = 0;
    for (const key of keys) {
        if (key in obj) {
            numKeysFound++;
            if (!requireAll && !restrictKeys) {
                return true;
            }
        } else if (requireAll) { // and a key is not found
            return false;
        } 
    }
    if (restrictKeys) {
        // If restrictKeys is true, check that no other keys are present in the object
        const objKeys = Object.keys(obj);
        const extraKeys = objKeys.filter(k => !keys.includes(k as keyof T & string));
        if (extraKeys.length > 0) {
            return false; // Found keys not in the allowed list
        }
    }
    return requireAll ? numKeysFound === keys.length : numKeysFound > 0; 
}


/**
 * @param objA `Record<string, any>`
 * @param objB `Record<string, any>`
 * @returns **`areEquivalentObjects`** `boolean`
 * - `true` `if` `objA` and `objB` are equivalent objects (same keys and values, including nested objects and arrays),
 * - `false` `otherwise`.
 */
export function areEquivalentObjects(
    objA: Record<string, any>, 
    objB: Record<string, any>
): boolean {
    if (!objA || typeof objA !== 'object' || !objB || typeof objB !== 'object') {
        return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => {
        if (!hasKeys(objB, key)) return false; // key not in both objects
        const valA = objA[key];
        const valB = objB[key];
        if (Array.isArray(valA) && Array.isArray(valB)) {
            return valA.length === valB.length 
                && valA.every((item) => valB.includes(item));
        } else if (typeof valA === "object" && valA && typeof valB === "object" && valB) {
            return areEquivalentObjects(valA, valB);
        }
        return equivalentAlphanumericStrings(valA, valB);
    });
}

export function isNumericString(value: any): boolean {
    if (typeof value !== 'string') return false;
    return !isNaN(Number(value.trim()));
}

/**
 * @param value `any`
 * @returns **`isNonEmptyString`** `boolean`
 * - `true` `if` `value` is a non-empty string (not just whitespace),
 * - `false` `otherwise`.
 */
export function isNonEmptyString(
    value: any
): value is string & { length: number } {
    return typeof value === 'string' && value.trim() !== '';
}


export function isPrimitiveValue(
    value: any
): value is string | number | boolean | null | undefined {
    if (value === null || value === undefined) {
        return true; // null and undefined are considered primitive
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return true; // string, number, and boolean are primitive types
    }
    return false;
}

/**
 * @param value `any` 
 * @param requireNonNegative `boolean`
 * - `if` `true` then require that `value` be an integer `>= 0`
 * - `if` `false` then the sign of the number doesn't matter
 * @returns **`isInteger`** `boolean`
 */
export function isInteger(value: any, requireNonNegative: boolean = false): value is number {
    return (typeof value === 'number' 
        && Number.isInteger(value)
        && (requireNonNegative ? value >= 0 : true)
    );
}

/**
 * - determines if `value` is a **non-array object** 
 * - kind of redundant with {@link hasNonTrivialKeys}
 * @param value `any` 
 * @param allowEmpty `boolean` `default = true`
 * - `if` `true` then `value` is allowed to be an empty non-array object
 * - `if` `false` then `value` must have at least 1 key
 * @returns **`isObject`** `boolean`
 */
export function isObject(value: any, allowEmpty: boolean = true): Record<string, any> {
    return (value && typeof value === 'object'
        && !Array.isArray(value)
        && (allowEmpty || Object.keys(value).length > 0)
    );
}

/**
 * @TODO deprecate and remove this
 * @enum {string} **`TypeOfEnum`**
 * @property **`STRING`** = `'string'`
 * @property **`NUMBER`** = `'number'`
 * @property **`BOOLEAN`** = `'boolean'`
 * @property **`OBJECT`** = `'object'`
 * @property **`FUNCTION`** = `'function'`
 */
export enum TypeOfEnum {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    OBJECT = 'object',
    FUNCTION = 'function',
}