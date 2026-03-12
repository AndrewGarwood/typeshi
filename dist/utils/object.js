"use strict";
/**
 * @file src/utils/object.ts
 * @TODO just use zod instead
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restrict = void 0;
exports.sanitizeAndMap = sanitizeAndMap;
exports.hasDefinedEntry = hasDefinedEntry;
exports.hasValidKeysOnly = hasValidKeysOnly;
exports.picked = picked;
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
 * @returns `Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;`
 */
function hasDefinedEntry(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;
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
