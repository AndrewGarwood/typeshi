"use strict";
/**
 * @file src/utils/object.ts
 * @TODO just use zod instead
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restrict = void 0;
exports.hasValidKeysOnly = hasValidKeysOnly;
exports.picked = picked;
exports.sanitizeAndMap = sanitizeAndMap;
exports.hasDefinedEntry = hasDefinedEntry;
const typeValidation_1 = require("./typeValidation");
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
/**
 * @param obj `any` - source object (e.g., Request Body)
 * @param schema {@link TransformationSchema}`<T>` - map of keys to transformation functions
 * @param passThroughKeys `(keyof T)[]` - keys to move over without transformation (Identity mapping)
 * @returns **`data`** `T` - new object with keys/values from generated from `schema` & `passThroughKeys`
 */
function sanitizeAndMap(obj, schema, passThroughKeys = []) {
    const data = {};
    // 1. Handle explicit transformations
    for (const key in schema) {
        const schemaValue = schema[key];
        if (!schemaValue)
            continue;
        if (hasDefinedEntry(obj, key)) {
            if ((0, typeValidation_1.isFunction)(schemaValue)) {
                data[key] = schemaValue(obj[key]);
            }
            else if ((0, typeValidation_1.isFunction)(schemaValue.transform)) {
                data[key] = schemaValue.transform(obj[key], ...(schemaValue.args ?? []));
            }
        }
        else if (!(0, typeValidation_1.isFunction)(schemaValue) && 'defaultValue' in schemaValue) { // can apply defaultValue
            data[key] = schemaValue.defaultValue;
        }
    }
    // 2. Handle simple pass-throughs (Identity mapping)
    for (const key of passThroughKeys) {
        if (!data[key] && hasDefinedEntry(obj, key)) {
            data[key] = obj[key];
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
