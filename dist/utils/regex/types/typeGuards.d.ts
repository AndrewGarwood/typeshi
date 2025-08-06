/**
 * @file src/utils/regex/types/typeGuards.ts
 */
import { CleanStringOptions } from ".";
/**
 * - {@link CleanStringOptions}
 * @param value `any`
 * @returns **`isCleanStringOptions`** `boolean`
 * - **`true`** if the `value` is an object with at least one key in `['strip', 'case', 'pad', 'replace']` and no other keys,
 * - **`false`** `otherwise`.
 */
export declare function isCleanStringOptions(value: any): value is CleanStringOptions;
