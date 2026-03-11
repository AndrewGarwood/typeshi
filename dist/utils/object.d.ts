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
/**
 * define a `TransformationSchema<T>` to use in `sanitizeAndMap` to convert
 * an initial object `any` to `T`. the `"initial"` object is assumed to share props with `T`
 * (hence the need to transform its values)
 *
 * values are either:
 * 1. a `function` where only need to pass in `initial[K]` to get the transformed value `T[K]`
 * 2. an `object` with props:
 * - `transform (function, optional)` - function that uses `initial[K]` & `args` to compute `T[K]`
 * - `args (any[], optional)` - the array of arguments passed into `transform` using the spread operator.
 * - `defaultValue (T[K], optional)` - assign this value to `K` when `transform` is `undefined`
 * and `initial[K]` is `undefined`
 */
export type TransformationSchema<T> = {
    [K in keyof T]?: ((val: any) => T[K]) | {
        transform?: (val: any, ...args: any[]) => T[K];
        args?: any[];
        defaultValue?: T[K];
    };
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
