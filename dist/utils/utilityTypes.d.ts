/**
 * @file src/utils/utilityTypes.ts
 */
export type NumberKeys<T, Required extends boolean = false> = {
    [K in keyof T]: Required extends true ? (T[K] extends number ? K : never) : (T[K] extends number | undefined ? K : never);
}[keyof T][];
export type ArrayKeys<T, Required extends boolean = false> = {
    [K in keyof T]: Required extends true ? (T[K] extends Array<any> ? K : never) : (T[K] extends Array<any> | undefined ? K : never);
}[keyof T][];
export type ArrayOfTypeKeys<T, U, Required extends boolean = false> = {
    [K in keyof T]: Required extends true ? (T[K] extends Array<U> ? K : never) : (T[K] extends Array<U> | undefined ? K : never);
}[keyof T][];
export type StringKeys<T, Required extends boolean = false> = {
    [K in keyof T]: Required extends true ? (T[K] extends string ? K : never) : (T[K] extends string | undefined ? K : never);
}[keyof T][];
export type PrimitiveKeys<T, Required extends boolean = false> = {
    [K in keyof T]: Required extends true ? (T[K] extends string | number | boolean | null ? K : never) : (T[K] extends string | number | boolean | null | undefined ? K : never);
}[keyof T][];
export type Primitive = string | number | boolean | null | undefined;
/** Get the union of all values of `T` (like `valueof T`) */
export type ValueOf<T> = T[keyof T];
/**
 * Keys of `T` whose values extend a given type `U`
 * @template T - The object type
 * @template U - The type to check each `T[K]` against
 * @template Required - Whether the key is required (allows for `undefined` values if `false`) `default = false`
 */
export type KeysOfType<T, U, Required extends boolean = false> = {
    [K in keyof T]: Required extends true ? (T[K] extends U ? K : never) : (T[K] extends U | undefined ? K : never);
}[keyof T][];
/**
 * use for non-strict autocomplete of enum/literal value types
 * @example
 * JobPlatformEnum = { GREENHOUSE: 'GREENHOUSE', WORKDAY: 'WORKDAY' } as const;
 * type JobPlatformEnum = (typeof JobPlatformEnum)[keyof typeof JobPlatformEnum]; // 'GREENHOUSE' | 'WORKDAY'
 * let key: NonStrict<JobPlatformEnum>; // `key` allows any string, but will have the enum values as suggested auto-complete values
 * key = 'hello'; // ok
 * key = 9; // Error: Type '9' is not assignable to type 'NonStrict<JobPlatformEnum>'
 * */
export type NonStrict<T extends string | number> = T | (T extends string ? (string & {}) : (number & {}));
