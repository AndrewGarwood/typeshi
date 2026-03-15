/**
 * @file src/utils/object.ts
 * @TODO just use zod instead
 */

import { isFunction } from "./typeValidation";


/**
 * define a `TransformationSchema<T, S>` to use in `sanitizeAndMap`, where entries from
 * a `source` object `S` are mapped to a new object `T`
 * 
 * `values` are either:
 * 1. a `function` where only need to pass in `source[K]` to get the transformed value `T[K]`
 * 2. {@link TransformOptions}, an object with props:
 * - `sourceKey (keyof S, optional)` - indicates that should transform `source[sourceKey]` to `T[K]`.
 * `sourceKey = TransformOptions.sourceKey ?? K`
 * - `transform (function, optional)` - `function` that uses `source[sourceKey]` & `args` to compute `T[K]`
 * - `args (any[], optional)` - the array of arguments passed into `transform` using the spread operator, i.e. `transform(source[sourceKey], ...args)`
 * - `defaultValue (T[K], optional)` - assign this value to `K` **only when** `transform` is `undefined` 
 * and `source[sourceKey]` is `undefined`
 */
export type TransformationSchema<T extends object, S extends object = any> = { 
    [K in keyof T]?: ((val: any) => T[K]) | TransformOptions<T, K, S>; 
};
export type TransformOptions<
    T extends object, 
    K extends keyof T, 
    S extends object = any
> = {
    transform?: (val: any, ...args: any[]) => T[K];
    args?: any[];
    defaultValue?: T[K];
    sourceKey?: keyof S;
}; 

/**
 * @param obj `S` - source object (e.g., Request Body)
 * @param schema {@link TransformationSchema}`<T, S>` - map of keys to transformation functions.
 * @param passThroughKeys `(keyof T & keyof S)[] (optional)` - keys to move over without transformation (Identity mapping)
 * @returns **`data`** `T` - new object with keys/values from generated from `schema` & `passThroughKeys`
 */
export function sanitizeAndMap<T extends object, S extends object = any>(
    obj: S,
    schema: TransformationSchema<T, S>,
    passThroughKeys: (keyof T & keyof S)[] = []
): T {
    const data = {} as any;
    // 1. Handle explicit transformations
    for (const key in schema) {
        const schemaValue = schema[key];
        if (!schemaValue) continue;
        const sourceKey = ('sourceKey' in schemaValue && schemaValue.sourceKey 
            ? schemaValue.sourceKey 
            : key
        ) as keyof S;
        if (hasDefinedEntry(obj, sourceKey)) {
            if (isFunction(schemaValue)) { // schemaValue is ((val: any) => T[K])
                data[key] = schemaValue(obj[sourceKey]);
            } else if (isFunction(schemaValue.transform)) { // schemaValue is { transform?: (val: any, ...args: any[]) => T[K]; args?: any[]; sourceKey?: keyof S}
                data[key] = schemaValue.transform(obj[sourceKey], ...(schemaValue.args ?? []));
            }
        } else if (!isFunction(schemaValue) && 'defaultValue' in schemaValue) {  
            // `obj[K]` is `undefined`, can apply defaultValue
            data[key] = schemaValue.defaultValue;
        }
    }
    // 2. Handle simple pass-throughs (Identity mapping)
    for (const key of passThroughKeys) {
        if (key in data) continue; // already handled
        if (hasDefinedEntry(obj, key)) {
            data[key] = obj[key];
        } else if (key in schema && schema[key]) { // no value available to pass through, but can assign defaultValue
            const schemaValue = schema[key];
            if (!isFunction(schemaValue) && 'defaultValue' in schemaValue) {
                data[key] = schemaValue.defaultValue;
            }
        }
    }
    return data as T;
}

/**
 * @returns `boolean`
 * - `true` if all keys in obj are also in validKeys
 * - `false` if there exists a key in obj that is not in validKeys
 */
export function hasValidKeysOnly<T extends object>(
    obj: object, 
    validKeys: readonly (keyof T)[]
): obj is T {
    return Object.keys(obj).every(key => validKeys.includes(key as keyof T));
}

/**
 * @returns a new object containing only the specified keys.
 */
export function picked<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> {
    const result = {} as Pick<T, K>;    
    for (const key of keys) {
        if (key in obj && obj[key] !== undefined) result[key] = obj[key];
    }
    return result;
}




// @TODO could try to generalize enforceMaxLength to handle objects operating on Object.keys()/Object.entries()
// but I don't think hashed keys of dicts/objects retain consistent information on what order they were added to object...
/**
 * @param arr `T[]`
 * @param maxLength `number` an integer greater than or equal to `0`
 * - the original array is returned if `maxLength < 0`
 * - converts `float` to `int` with `Math.floor()`;
 * @note **original array is returned if `arr.length <= Math.floor(maxLength)`**
 * @param principle `'LIFO' | 'FIFO' (optional)` `default = 'LIFO'`
 * `(if arr.length > maxLength)` indicate from which end of array to remove elements 
 * - `'LIFO'` - remove elements from end (`'Last-In-First-Out'`)
 * - `'FIFO'` - remove elements from front (`'First-In-First-Out'`)
 * @note **assumes newest elements were pushed to end** i.e. `stack.push()` or `queue.enque()`
 * @param inPlace `boolean (optional)` `default = true`
 * - `true` - modify and return original array using: `arr.length = maxLength (LIFO)` or `arr.splice() (FIFO)`
 * - `false` - return new array with: `arr.slice()` `arr.slice(0, maxLength) (LIFO) or arr.slice(i, n) (FIFO)` where `n - i === maxLength`
 * @returns **`arr`** `T[]` where `arr.length <= maxLength`
 */
export function enforceMaxLength<T = unknown>(
    arr: T[], 
    maxLength: number, 
    principle: 'LIFO' | 'FIFO' = 'LIFO',
    inPlace: boolean = true
): T[] {
    if (maxLength < 0) return arr;
    maxLength = Math.floor(maxLength);
    if (maxLength === 0) {
        if (inPlace) {
            arr.length = 0;
            return arr;
        } else {
            return [];
        }
    }
    const n = arr.length;
    if (n <= maxLength) return arr;
    const excess = n - maxLength;
    if (inPlace) {
        if (principle === 'LIFO') {
            arr.length = maxLength;
        } else { // 'FIFO'
            arr.splice(0, excess);
        }
        return arr;
    } else {
        if (principle === 'LIFO') {
            return arr.slice(0, maxLength);
        } else { // 'FIFO'
            return arr.slice(excess);
        }
    }
}


export class Restrict {
    /**
     * `hasValidKeysOnly`
     * @returns `boolean` - `true` if `obj` contains ONLY keys found in `validKeys`
     */
    static keys = hasValidKeysOnly;
    /**
     * @returns a new object containing only the specified keys.
     */
    static toPicked = picked;
    
    /**
     * @param arr `T[]`
     * @param maxLength `number` an integer greater than or equal to `0`
     * - the original array is returned if `maxLength < 0`
     * - converts `float` to `int` with `Math.floor()`;
     * @note **original array is returned if `arr.length <= Math.floor(maxLength)`**
     * @param principle `'LIFO' | 'FIFO' (optional)` `default = 'LIFO'`
     * `(if arr.length > maxLength)` indicate from which end of array to remove elements 
     * - `'LIFO'` - remove elements from end (`'Last-In-First-Out'`)
     * - `'FIFO'` - remove elements from front (`'First-In-First-Out'`)
     * @note **assumes newest elements were pushed to end** i.e. `stack.push()` or `queue.enque()`
     * @param inPlace `boolean (optional)` `default = true`
     * - `true` - modify and return original array with: `arr.length = maxLength (LIFO)` or `arr.splice() (FIFO)`
     * - - if `'LIFO'`, can use JS trick by setting `arr.length = maxLength`
     * - `false` - return new array with: `arr.slice()` `arr.slice(0, maxLength) (LIFO) or arr.slice(i, n) (FIFO)` where `n - i === maxLength`
     * @returns **`arr`** `T[]` where `arr.length <= maxLength`
     */
    static arrayLength = enforceMaxLength;
}


/**
 * @returns `Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;`
 */
export function hasDefinedEntry<T extends object>(obj: any, key: keyof T | keyof any): boolean { // obj is Record<keyof T, any> 
    return Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;
}

/** 
 * @returns **`containsKey`** `boolean = obj is { [K in keyof T]: T[K] }`
 * - `true` if **`all`** `k` in `keys` return true for `Object.prototype.hasOwnProperty.call(obj, k)`
 * - `false` otherwise
 */
export function containsKey<T extends object, K extends (keyof T | (keyof any & {})) = any>(
    obj: T, 
    ...keys: K[]
): obj is { [K in keyof T]: T[K] } {
    for (let k of keys) {
        if (!Object.prototype.hasOwnProperty.call(obj, k)) return false; 
    }
    return true;
}