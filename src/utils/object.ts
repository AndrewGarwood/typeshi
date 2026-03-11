/**
 * @file src/utils/object.ts
 * @TODO just use zod instead
 */

import { isFunction } from "./typeValidation";

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
}

/**
 * **`values`** are either:
 * - a `function` where only need to pass in single value to get the transformed value `T[K]`
 * - an object with two props: `transform` & `args` where `args` is the array of arguments
 * passed into `transform` using the spread operator. 
 */
export type TransformationSchema<T> = { 
    [K in keyof T]?: ((val: any) => T[K]) | {
        transform: (val: any, ...args: any[]) => T[K];
        args: any[]
    }; 
};

/**
 * @param obj `any` - source object (e.g., Request Body)
 * @param schema {@link TransformationSchema}`<T>` - map of keys to transformation functions
 * @param passThroughKeys `(keyof T)[]` - keys to move over without transformation (Identity mapping)
 * @returns **`data`** `T` - new object with keys/values from generated from `schema` & `passThroughKeys`
 */
export function sanitizeAndMap<T extends object>(
    obj: any,
    schema: TransformationSchema<T>,
    passThroughKeys: (keyof T)[] = []
): T {
    const data = {} as any;
    // 1. Handle explicit transformations
    for (const key in schema) {
        if (schema[key] && hasDefinedEntry(obj, key as keyof T)) {
            if (isFunction(schema[key])) {
                data[key] = schema[key](obj[key]);
            } else {
                data[key] = schema[key].transform(obj[key], ...schema[key].args)
            }
        }
    }
    // 2. Handle simple pass-throughs (Identity mapping)
    for (const key of passThroughKeys) {
        if (!data[key] && hasDefinedEntry(obj, key)) {
            data[key] = obj[key];
        }
    }
    return data as T;
}

/**
 * @returns `Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;`
 */
export function hasDefinedEntry<T extends object>(obj: any, key: keyof T): boolean { // obj is Record<keyof T, any> 
    return Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;
}