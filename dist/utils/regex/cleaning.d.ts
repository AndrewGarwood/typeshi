import { CleanStringOptions, StringCaseOptions, StringPadOptions, StringReplaceOptions, StringStripOptions } from "./";
export declare function clean(s: string, options?: CleanStringOptions): string;
/**
 * @description
 * - converts to string and trims, then:
 * - applies options in this order: `StringReplaceOptions`, `StringStripOptions`, `StringCaseOptions`, `StringPadOptions`
 * - Removes leading+trailing spaces, extra spaces, commas, and dots from a string (e.g. `'..'` becomes `'.'`)
 * - optionally applies 4 option params with: {@link string.replace}, {@link applyStripOptions}, {@link applyCaseOptions}, and {@link applyPadOptions}.
 * @param s `string` to clean
 * @param stripOptions {@link StringStripOptions}
 * - `optional` strip options to apply to the string
 * - = `{ char: string, escape?: boolean, stripLeftCondition?: (s: string, ...args: any[]) => boolean, leftArgs?: any[], stripRightCondition?: (s: string, ...args: any[]) => boolean, rightArgs?: any[] }`
 * @param caseOptions {@link StringCaseOptions}
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
export declare function clean(s: string, stripOptions?: StringStripOptions, caseOptions?: StringCaseOptions, padOptions?: StringPadOptions, replaceOptions?: StringReplaceOptions): string;
/**
 * @param s `string` - the string to convert to title case
 * @returns **`s`** `string` - the string in title case
 * (i.e. first letter of each word, determined by the `\b` boundary metacharacter, is capitalized)
 */
export declare function toTitleCase(s: string): string;
/**
 * @param s `string`
 * @param replaceOptions `Array<`{@link StringReplaceParams}`>`
 * @returns **`s`** `string` with replace options applied
 */
export declare function applyReplaceOptions(s: string, replaceOptions: StringReplaceOptions): string;
/**
 * @param s `string` - the string to handle case options for
 * @param caseOptions — {@link StringCaseOptions} - `optional` case options to apply to the string
 * = `{ toUpper: boolean, toLower: boolean, toTitle: boolean }`
 * - applies the first case option that is `true` and ignores the rest
 * @returns **`s`** - the string with case options applied
 */
export declare function applyCaseOptions(s: string, caseOptions?: StringCaseOptions): string;
/**
 * @param s `string` - the string to handle padding options for
 * @param padOptions — {@link StringPadOptions} - `optional` padding options to apply to the string
 * = `{ padLength: number, padChar: string, padLeft: boolean, padRight: boolean }`
 * - applies the first padding option that is `true` and ignores the rest
 * @returns **`s`** - the string with padding options applied
 * @note `if` `s.length >= padLength`, no padding is applied
 */
export declare function applyPadOptions(s: string, padOptions?: StringPadOptions): string;
/**
 * @param s `string`
 * @param stripOptions — {@link StringStripOptions}
 * = `{ char: string, escape?: boolean, stripLeftCondition?: (s: string, ...args: any[]) => boolean, leftArgs?: any[], stripRightCondition?: (s: string, ...args: any[]) => boolean, rightArgs?: any[] }`
 * - if `stripLeftCondition(s, leftArgs)` is `true` or `stripLeftCondition` is `undefined` (i.e. no conditions need to be met to strip left):
 * - - then the left side of the `s` is stripped of `char`
 * - if `stripRightCondition(s, rightArgs)` is `true` or `stripRightCondition` is `undefined` (i.e. no conditions need to be met to strip right):
 * - - then the right side of the `s` is stripped of `char`
 * @param stripOptions.escape escape special regex characters in `char` with `char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`
 * @returns `string` - the string with leading and trailing characters removed
 */
export declare function applyStripOptions(s: string, stripOptions: StringStripOptions): string;
