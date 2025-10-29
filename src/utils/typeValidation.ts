/**
 * @file src/utils/typeValidation.ts
 */

import { equivalentAlphanumericStrings } from "./regex/index";


/**
 * - alias for {@link isNullLike}
 * ... maybe should just change name of isNullLike but that might break things...
 * @param value `any` the value to check
 * @returns **`isNullLike`** `boolean` = `value is '' | (Array<any> & { length: 0 }) | null | undefined | Record<string, never>`
 * - **`true`** `if` the `value` is null, undefined, empty object (no keys), empty array, or empty string
 * - **`false`** `otherwise`
 */
export const isEmpty = isNullLike;
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
 * @param requireNonNegative `boolean` `default = false`
 * @param requireNonEmpty `boolean` `default = true`
 * - `if` `true` then `value` must be array with at least 1 element
 * - `if` `false` then `value` can be empty array
 * @returns **`isIntegerArray`** `boolean` = `value is Array<number> & { length: number }`
 */
export function isIntegerArray(
    value: any, 
    requireNonNegative: boolean = false, 
    requireNonEmpty: boolean = true
): value is Array<number> & { length: number } {
    return (requireNonEmpty 
        ? isNonEmptyArray(value) && value.every(el=>isInteger(el, requireNonNegative))
        : isEmptyArray(value)
    );
}


/**
 * @consideration add param to allow for empty strings?
 * @param value `any`
 * @param requireNonEmpty `boolean` `default = true`
 * - `if` `true` then `value` must be array with at least 1 element
 * - `if` `false` then `value` can be empty array
 * @returns **`isStringArray`** `boolean` = `value is Array<string> & { length: number }`
 */
export function isStringArray(
    value: any,
    requireNonEmpty: boolean = true
): value is Array<string> & { length: number } {
    return (requireNonEmpty 
        ? isNonEmptyArray(value) && value.every(el => isNonEmptyString(el)) 
        : isEmptyArray(value)
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

/**
 * @param value `any`
 * @param requireInteger `boolean` `default = false`
 * @param requireNonNegative `boolean` `default = false`
 * @returns **`isNumeric`** `value is string | number`
 * - **`true`** `if` `value` is either a `number` or a `string` that can be casted to a `number`
 * while also meeting the boolean parameter requirements
 * - **`false`** `otherwise`
 */
export function isNumeric(
    value: any, 
    requireInteger: boolean = false, 
    requireNonNegative: boolean = false
): value is string | number {
    let numValue: number;
    if (typeof value === 'number') {
        numValue = value;
    } else if (isNonEmptyString(value)) {
        const trimmed = value.trim();
        if (isNaN(Number(trimmed))) {
            return false;
        }
        numValue = Number(trimmed);
    } else {
        return false;
    }
    if (requireInteger && !Number.isInteger(numValue)) {
        return false;
    }
    if (requireNonNegative && numValue < 0) {
        return false;
    }
    return true;
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
 * @param value `any` 
 * @param requireNonEmpty `boolean` `default = true`
 * - `if` `true` then `value` must have at least 1 key
 * - `if` `false` then `value` is allowed to be an empty object
 * @param requireNonArray `boolean` `default = true`
 * - `if` `true` then `value` must not be an array
 * - `if` `false` then `value` is allowed to be an array
 * @returns **`isObject`** `boolean` `value is Record<string, any>`
 */
export function isObject(
    value: any, 
    requireNonEmpty: boolean = true,
    requireNonArray: boolean = true
): value is Record<string, any> {
    return (value && typeof value === 'object'
        && (requireNonArray ? !Array.isArray(value) : true)
        && (requireNonEmpty ? Object.keys(value).length > 0 : true)
    );
}
// isPosInt
export function isPositveInteger(value: any): value is number {
    return (typeof value === 'number' 
        && Number.isInteger(value) 
        && value > 0
    );
}

export const isType = <T>(value: any, guard: (v: any, ...args: any[]) => v is T, ...args: any[]): value is T => {
    return guard(value, ...args);
}

/**
 * - calls {@link isUndefinedOrNull}`(value)` which allows for value to be `undefined` or `null`
 * - use {@link isUndefinedOr} if you want value is `T | undefined`
 */
export class isOptional {
    static type = <T>(value: any, guard: (v: any, ...args: any[]) => v is T, ...args: any[]): value is T | undefined | null => {
        return isUndefinedOrNull(value) || isType<T>(value, guard, ...args)
    }
    /**
     * @param value 
     * @param requireNonEmpty `boolean` `default` = `true` (if `true`, require that string have at least 1 non-whitespace character)
     * @returns 
     */
    static string = (value: any, requireNonEmpty: boolean = true): value is string | undefined | null => {
        return isUndefinedOrNull(value) || requireNonEmpty ? isNonEmptyString(value) : typeof value === "string"
    }
    /**
     * @param value 
     * @param requireNonEmpty `boolean` `default` = `true` (if `true`, require that array have at least 1 element)
     * @returns 
     */
    static stringArray = (value: any, requireNonEmpty: boolean = true): value is string[] | undefined | null => {
        return isUndefinedOrNull(value) || isStringArray(value, requireNonEmpty)
    }
    static numeric = (
        value: any, 
        requireInteger: boolean = false, 
        requireNonNegative: boolean = false
    ): value is string | number | undefined | null => {
        return isUndefinedOrNull(value) || isNumeric(value, requireInteger, requireNonNegative)
    }
    static number = (
        value: any,
        requireInteger: boolean = false, 
        requireNonNegative: boolean = false
    ): value is number | undefined | null => {
        return isUndefinedOrNull(value) || (
            isNumeric(value, requireInteger, requireNonNegative) 
            && typeof value === 'number'
        )
    }
    static positiveInteger = (value: any): value is number | undefined | null => {
        return (isUndefinedOrNull(value) || isPositveInteger(value))
    }
    static integerArray = (
        value: any, 
        requireNonNegative: boolean = false, 
        requireNonEmpty: boolean = true
    ): value is number[] | undefined | null => {
        return isUndefinedOrNull(value) || isIntegerArray(value, requireNonNegative, requireNonEmpty)
    }
    static boolean = (value: any): value is boolean | undefined | null => {
        return isUndefinedOrNull(value) || isBoolean(value);
    }
    static function = (value: any): value is Function | undefined | null => {
        return isUndefinedOrNull(value) || isFunction(value);
    }
}

export class isUndefinedOr {
    static type = <T>(value: any, guard: (v: any, ...args: any[]) => v is T, ...args: any[]): value is T | undefined => {
        return isUndefined(value) || isType<T>(value, guard, ...args)
    }
    /**
     * @param value 
     * @param requireNonEmpty `boolean` `default` = `true` (if `true`, require that string have at least 1 non-whitespace character)
     * @returns 
     */
    static string = (value: any, requireNonEmpty: boolean = true): value is string | undefined => {
        return isUndefined(value) || requireNonEmpty ? isNonEmptyString(value) : typeof value === "string"
    }
    /**
     * @param value 
     * @param requireNonEmpty `boolean` `default` = `true` (if `true`, require that array have at least 1 element)
     * @returns 
     */
    static stringArray = (value: any, requireNonEmpty: boolean = true): value is string[] | undefined => {
        return isUndefined(value) || isStringArray(value, requireNonEmpty)
    }
    static numeric = (
        value: any, 
        requireInteger: boolean = false, 
        requireNonNegative: boolean = false
    ): value is string | number | undefined => {
        return isUndefined(value) || isNumeric(value, requireInteger, requireNonNegative)
    }
    static number = (
        value: any,
        requireInteger: boolean = false, 
        requireNonNegative: boolean = false
    ): value is number | undefined => {
        return isUndefined(value) || (
            isNumeric(value, requireInteger, requireNonNegative) 
            && typeof value === 'number'
        )
    }
    static positiveInteger = (value: any): value is number | undefined => {
        return (isUndefined(value) || isPositveInteger(value))
    }
    static integerArray = (
        value: any, 
        requireNonNegative: boolean = false, 
        requireNonEmpty: boolean = true
    ): value is number[] | undefined => {
        return isUndefined(value) || isIntegerArray(value, requireNonNegative, requireNonEmpty)
    }
    static boolean = (value: any): value is boolean | undefined => {
        return isUndefined(value) || isBoolean(value);
    }
    static function = (value: any): value is Function | undefined => {
        return isUndefined(value) || isFunction(value);
    }
}
/**
 * these may be unnecessary, but added for completeness
 */
/**
 * @param value `any`
 * @returns **`isBoolean`** `boolean`
 */
export function isBoolean(value: any): value is boolean {
    return (typeof value === 'boolean');
}

/**
 * @param value `any`
 * @returns **`isFunction`** `boolean`
 */
export function isFunction(value: any): value is Function {
    return (typeof value === 'function');
}

/**
 * - passing in `null` returns `false`
 * @param value `any`
 * @returns **`isUndefined`** `boolean` `return value === undefined`
 */
export function isUndefined(value: any): value is undefined {
    return value === undefined;
}

export function isUndefinedOrNull(value: unknown): value is undefined | null {
    return value === undefined || value === null;
}

// ============================================================================
// Utility Types ... useful for auto-completion
// ============================================================================

export type NumberKeys<T, Required extends boolean = false> = {
    [K in keyof T]: Required extends true
        ? (T[K] extends number ? K : never)
        : (T[K] extends number | undefined ? K : never)
}[keyof T][];

export type ArrayKeys<T, Required extends boolean = false> = {
    [K in keyof T]: Required extends true
        ? (T[K] extends Array<any> ? K : never)
        : (T[K] extends Array<any> | undefined ? K : never)
}[keyof T][];

export type ArrayOfTypeKeys<T, U, Required extends boolean = false> = {
    [K in keyof T]: Required extends true
        ? (T[K] extends Array<U> ? K : never)
        : (T[K] extends Array<U> | undefined ? K : never)
}[keyof T][];

export type StringKeys<T, Required extends boolean = false> = {
    [K in keyof T]: Required extends true
        ? (T[K] extends string ? K : never)
        : (T[K] extends string | undefined ? K : never)
}[keyof T][];


export type PrimitiveKeys<T, Required extends boolean = false> = {
    [K in keyof T]: Required extends true
        ? (T[K] extends string | number | boolean | null ? K : never)
        : (T[K] extends string | number | boolean | null | undefined ? K : never)
}[keyof T][];

export type Primitive = string | number | boolean | null | undefined;

/** Get the union of all values of `T` (like `valueof T`) */
export type ValueOf<T> = T[keyof T];

/** Keys of `T` whose values extend a given type `U` */
export type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never
}[keyof T][];