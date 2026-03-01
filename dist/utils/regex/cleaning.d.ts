import { StringCaseEnum, StringPadOptions, StringCleanOptions, StringReplaceParams, StringStripOptions } from "./types";
/**
 * @param s `string`
 * @param options {@link StringCleanOptions} `(optional)`
 * @param options.useDefault `boolean (optional)` `default` = `true`
 * - `if true` - calls `s.trim()` and replaces `/\s{2,}/g` with single space, `/\.{2,}/g` with single period, and `/,{2,}/g` with single comma
 * *before* proceeding with remaining operations
 * @returns **`s`** `string` = the modified string after applying operations specified in `options`
 */
export declare function clean(s: string, options?: StringCleanOptions): string;
/**
 * @param s `string`
 * @param options {@link StringStripOptions} = `{ char?: string, left?: StringStripCondition, right?: StringStripCondition }`
 * @returns **`s`**
 */
export declare function applyStripOptions(s: string, options: StringStripOptions): string;
/**
 * @param s `string`
 * @param replaceParams `Array<`{@link StringReplaceParams}`>`
 * @returns **`s`** `string` with replace options applied
 */
export declare function applyReplaceParams(s: string, replaceParams: StringReplaceParams[]): string;
/**
 * @param s `string`
 * @param options {@link StringPadOptions}
 * @param options.side `'left' | 'right' | 'both'`
 * - `left` -> use `s.padStart()`
 * - `right` -> use `s.padEnd()`
 * - `both` -> apply half padding to both sides
 * @returns **`s`** `string` padded to length = `options.maxLength`
 */
export declare function applyPadOptions(s: string, options: StringPadOptions): string;
/**
 * @param s `string`
 * @param caseOptions {@link StringCaseEnum} = `'upper' | 'lower' | 'title'`
 * @returns **`s`** `string` with case option applied
 */
export declare function applyCaseOptions(s: string, caseOptions: StringCaseEnum): string;
/**
 * @param s `string` - the string to convert to title case
 * @returns **`s`** `string` - the string in title case
 * (i.e. first letter of each word, determined by the `\b` boundary metacharacter, is capitalized)
 */
export declare function toTitleCase(s: string): string;
