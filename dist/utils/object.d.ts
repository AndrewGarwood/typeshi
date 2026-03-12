/**
 * @file src/utils/object.ts
 * @TODO just use zod instead
 */
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
export type TransformOptions<T extends object, K extends keyof T, S extends object = any> = {
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
export declare function sanitizeAndMap<T extends object, S extends object = any>(obj: S, schema: TransformationSchema<T, S>, passThroughKeys?: (keyof T & keyof S)[]): T;
/**
 * @returns `Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined;`
 */
export declare function hasDefinedEntry<T extends object>(obj: any, key: keyof T | keyof any): boolean;
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
