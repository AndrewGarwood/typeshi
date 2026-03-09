/**
 * @file src/utils/object.ts
 * @TODO just use zod instead
 */
/**
 * @returns `boolean`
 * - `true` if all keys in obj are also in validKeys
 * - `false` if there exists a key in obj that is not in validKeys
 */
export declare function hasValidKeysOnly<T extends object>(obj: object, validKeys: readonly (keyof T)[]): obj is T;
/**
 * @returns a new object containing only the specified keys.
 */
export declare function picked<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
export declare class Restrict {
    /**
     * `hasValidKeysOnly`
     * @returns `boolean` - `true` if `obj` contains ONLY keys found in `validKeys`
     */
    static keys: typeof hasValidKeysOnly;
    /**
     * @returns a new object containing only the specified keys.
     */
    static toPicked: typeof picked;
}
export type TransformationSchema<T> = {
    [K in keyof T]?: (val: any) => T[K];
};
/**
 * @param obj `any` - source object (e.g., Request Body)
 * @param schema {@link TransformationSchema}`<T>` - map of keys to transformation functions
 * @param passThroughKeys `(keyof T)[]` - keys to move over without transformation (Identity mapping)
 * @returns **`data`** `T` - new object with keys/values from generated from `schema` & `passThroughKeys`
 */
export declare function sanitizeAndMap<T extends object>(obj: any, schema: TransformationSchema<T>, passThroughKeys?: (keyof T)[]): T;
/**
 * @returns `Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;`
 */
export declare function hasDefinedEntry<T extends object>(obj: any, key: keyof T): boolean;
