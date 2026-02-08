import { DEP_CleanStringOptions, DEP_StringCaseOptions, DEP_StringPadOptions, StringCaseEnum, StringPadOptions, StringReplaceOptions, DEP_StringStripOptions, StringCleanOptions, StringReplaceParams, StringStripOptions } from "./types";
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
 * @deprecated
 * @param s `string` - the string to handle padding options for
 * @param padOptions — {@link StringPadOptions} - `optional` padding options to apply to the string
 * = `{ padLength: number, padChar: string, padLeft: boolean, padRight: boolean }`
 * - applies the first padding option that is `true` and ignores the rest
 * @returns **`s`** - the string with padding options applied
 * @note `if` `s.length >= padLength`, no padding is applied
 */
export declare function DEP_applyPadOptions(s: string, padOptions?: DEP_StringPadOptions): string;
/**
 * @param s `string`
 * @param stripOptions — {@link DEP_StringStripOptions}
 * = `{ char: string, escape?: boolean, stripLeftCondition?: (s: string, ...args: any[]) => boolean, leftArgs?: any[], stripRightCondition?: (s: string, ...args: any[]) => boolean, rightArgs?: any[] }`
 * - if `stripLeftCondition(s, leftArgs)` is `true` or `stripLeftCondition` is `undefined` (i.e. no conditions need to be met to strip left):
 * - - then the left side of the `s` is stripped of `char`
 * - if `stripRightCondition(s, rightArgs)` is `true` or `stripRightCondition` is `undefined` (i.e. no conditions need to be met to strip right):
 * - - then the right side of the `s` is stripped of `char`
 * @param stripOptions.escape escape special regex characters in `char` with `char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`
 * @returns `string` - the string with leading and trailing characters removed
 */
export declare function DEP_applyStripOptions(s: string, stripOptions: DEP_StringStripOptions): string;
/**
 * @param s `string` - the string to convert to title case
 * @returns **`s`** `string` - the string in title case
 * (i.e. first letter of each word, determined by the `\b` boundary metacharacter, is capitalized)
 */
export declare function toTitleCase(s: string): string;
/**
 * @deprecated use {@link applyCaseOptions} with {@link StringCaseEnum} instead
 * @param s `string` - the string to handle case options for
 * @param caseOptions — {@link DEP_StringCaseOptions} - `optional` case options to apply to the string
 * = `{ toUpper: boolean, toLower: boolean, toTitle: boolean }`
 * - applies the first case option that is `true` and ignores the rest
 * @returns **`s`** - the string with case options applied
 */
export declare function DEP_applyCaseOptions(s: string, caseOptions?: DEP_StringCaseOptions): string;
export declare function DEP_clean(s: string, options?: DEP_CleanStringOptions): string;
/**
 * @description
 * - converts to string and trims, then:
 * - applies options in this order: `StringReplaceOptions`, `StringStripOptions`, `StringCaseOptions`, `StringPadOptions`
 * - Removes leading+trailing spaces, extra spaces, commas, and dots from a string (e.g. `'..'` becomes `'.'`)
 * - optionally applies 4 option params with: {@link string.replace}, {@link DEP_applyStripOptions}, {@link DEP_applyCaseOptions}, and {@link DEP_applyPadOptions}.
 * @param s `string` to clean
 * @param stripOptions {@link DEP_StringStripOptions}
 * - `optional` strip options to apply to the string
 * - = `{ char: string, escape?: boolean, stripLeftCondition?: (s: string, ...args: any[]) => boolean, leftArgs?: any[], stripRightCondition?: (s: string, ...args: any[]) => boolean, rightArgs?: any[] }`
 * @param caseOptions {@link DEP_StringCaseOptions}
 * - `optional` case options to apply to the string
 * - = `{ toUpper: boolean, toLower: boolean, toTitle: boolean }`
 * @param padOptions {@link StringPadOptions}
 * - `optional` padding options to apply to the string
 * - = `{ padLength: number, padChar: string, padLeft: boolean, padRight: boolean }`
 * @param replaceOptions {@link StringReplaceOptions}
 * - `optional` replace options to apply to the string
 * - = `Array<`{@link StringReplaceParams}`>` = `{ searchValue: string | RegExp, replaceValue: string }[]`
 * @returns **`s`** `string`
 */
export declare function DEP_clean(s: string, stripOptions?: DEP_StringStripOptions, caseOptions?: DEP_StringCaseOptions, padOptions?: DEP_StringPadOptions, replaceOptions?: StringReplaceOptions): string;
