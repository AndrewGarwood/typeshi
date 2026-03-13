"use strict";
/**
 * @file src/utils/object.ts
 * @TODO just use zod instead
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restrict = void 0;
exports.sanitizeAndMap = sanitizeAndMap;
exports.hasValidKeysOnly = hasValidKeysOnly;
exports.picked = picked;
exports.enforceMaxLength = enforceMaxLength;
exports.hasDefinedEntry = hasDefinedEntry;
exports.containsKey = containsKey;
const typeValidation_1 = require("./typeValidation");
/**
 * @param obj `S` - source object (e.g., Request Body)
 * @param schema {@link TransformationSchema}`<T, S>` - map of keys to transformation functions.
 * @param passThroughKeys `(keyof T & keyof S)[] (optional)` - keys to move over without transformation (Identity mapping)
 * @returns **`data`** `T` - new object with keys/values from generated from `schema` & `passThroughKeys`
 */
function sanitizeAndMap(obj, schema, passThroughKeys = []) {
    const data = {};
    // 1. Handle explicit transformations
    for (const key in schema) {
        const schemaValue = schema[key];
        if (!schemaValue)
            continue;
        const sourceKey = ('sourceKey' in schemaValue && schemaValue.sourceKey
            ? schemaValue.sourceKey
            : key);
        if (hasDefinedEntry(obj, sourceKey)) {
            if ((0, typeValidation_1.isFunction)(schemaValue)) { // schemaValue is ((val: any) => T[K])
                data[key] = schemaValue(obj[sourceKey]);
            }
            else if ((0, typeValidation_1.isFunction)(schemaValue.transform)) { // schemaValue is { transform?: (val: any, ...args: any[]) => T[K]; args?: any[]; sourceKey?: keyof S}
                data[key] = schemaValue.transform(obj[sourceKey], ...(schemaValue.args ?? []));
            }
        }
        else if (!(0, typeValidation_1.isFunction)(schemaValue) && 'defaultValue' in schemaValue) {
            // `obj[K]` is `undefined`, can apply defaultValue
            data[key] = schemaValue.defaultValue;
        }
    }
    // 2. Handle simple pass-throughs (Identity mapping)
    for (const key of passThroughKeys) {
        if (key in data)
            continue; // already handled
        if (hasDefinedEntry(obj, key)) {
            data[key] = obj[key];
        }
        else if (key in schema && schema[key]) { // no value available to pass through, but can assign defaultValue
            const schemaValue = schema[key];
            if (!(0, typeValidation_1.isFunction)(schemaValue) && 'defaultValue' in schemaValue) {
                data[key] = schemaValue.defaultValue;
            }
        }
    }
    return data;
}
/**
 * @returns `boolean`
 * - `true` if all keys in obj are also in validKeys
 * - `false` if there exists a key in obj that is not in validKeys
 */
function hasValidKeysOnly(obj, validKeys) {
    return Object.keys(obj).every(key => validKeys.includes(key));
}
/**
 * @returns a new object containing only the specified keys.
 */
function picked(obj, keys) {
    const result = {};
    for (const key of keys) {
        if (key in obj && obj[key] !== undefined)
            result[key] = obj[key];
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
 * - `true` - modify and return original array with: `arr.length = maxLength (LIFO)` or `arr.splice() (FIFO)`
 * - - if `'LIFO'`, can use JS trick by setting `arr.length = maxLength`
 * - `false` - return new array with: `arr.slice()` `arr.slice(0, maxLength) (LIFO) or arr.slice(i, n) (FIFO)` where `n - i === maxLength`
 * @returns **`arr`** `T[]` where `arr.length <= maxLength`
 */
function enforceMaxLength(arr, maxLength, principle = 'LIFO', inPlace = true) {
    if (maxLength < 0)
        return arr;
    maxLength = Math.floor(maxLength);
    if (maxLength === 0) {
        if (inPlace) {
            arr.length = 0;
            return arr;
        }
        else {
            return [];
        }
    }
    const n = arr.length;
    if (n <= maxLength)
        return arr;
    const excess = n - maxLength;
    if (inPlace) {
        if (principle === 'LIFO') {
            arr.length = maxLength;
        }
        else {
            arr.splice(0, excess);
        }
        return arr;
    }
    else {
        if (principle === 'LIFO') {
            return arr.slice(0, maxLength);
        }
        else {
            return arr.slice(excess);
        }
    }
}
class Restrict {
}
exports.Restrict = Restrict;
/**
 * `hasValidKeysOnly`
 * @returns `boolean` - `true` if `obj` contains ONLY keys found in `validKeys`
 */
Restrict.keys = hasValidKeysOnly;
/**
 * @returns a new object containing only the specified keys.
 */
Restrict.toPicked = picked;
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
Restrict.arrayLength = enforceMaxLength;
/**
 * @returns `Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;`
 */
function hasDefinedEntry(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;
}
/**
 * @returns **`containsKey`** `boolean = obj is { [K in keyof T]: T[K] }`
 * - `true` if **`all`** `k` in `keys` return true for `Object.prototype.hasOwnProperty.call(obj, k)`
 * - `false` otherwise
 */
function containsKey(obj, ...keys) {
    for (let k of keys) {
        if (!Object.prototype.hasOwnProperty.call(obj, k))
            return false;
    }
    return true;
}
