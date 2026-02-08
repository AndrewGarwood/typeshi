"use strict";
/**
 * @file src/utils/regex/Str.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Str = void 0;
const stringOperations_1 = require("./stringOperations");
const cleaning_1 = require("./cleaning");
class Str {
}
exports.Str = Str;
/**
 * @param s `string`
 * @param prefixes `string | string[] | RegExp` possible starting string(s).
 * @param flags `RegExpFlagsEnum[] (Optional)` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
 * @returns **`true`** if the string starts with any of the prefixes, **`false`** otherwise.
 */
Str.startsWith = stringOperations_1.stringStartsWithAnyOf;
/**
 * Checks if a string ends with any of the specified suffixes.
 * @param s `string`
 * @param suffixes `string | string[] | RegExp` possible ending strings.
 * @param flags `RegExpFlagsEnum[] (Optional)` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
 * @returns **`true`** if the string ends with any of the suffixes, **`false`** otherwise.
 */
Str.endsWith = stringOperations_1.stringEndsWithAnyOf;
/**
 * @param s `string`
 * @param substrings `string | string[] | RegExp`
 * @param flags `RegExpFlagsEnum[] (Optional)` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
 * @returns **`true`** if the string contains any of the substrings, **`false`** otherwise.
 */
Str.contains = stringOperations_1.stringContainsAnyOf;
/**
 * Ignores case by default:
 * - converts `s1` & `s2` to lowercase and removes all non-alphanumeric characters from both strings,
 * - sorts the characters in both strings,
 * - then compares the two strings for equivalence.
 * @param s1 `string`
 * @param s2 `string`
 * @param tolerance `number` - a number between 0 and 1, default is `0.90`
 * @returns **`boolean`**
 * - **`true`** `if` the two alphanumeric strings are equivalent,
 * - **`false`** `otherwise`.
 */
Str.equivalentAlphanumeric = stringOperations_1.equivalentAlphanumericStrings;
/**
 * @param s `string`
 * @param options {@link StringCleanOptions} `(optional)`
 * @param options.useDefault `boolean (optional)` `default` = `true`
 * - `if true` - calls `s.trim()` and replaces `/\s{2,}/g` with single space, `/\.{2,}/g` with single period, and `/,{2,}/g` with single comma
 * *before* proceeding with remaining operations
 * @returns **`s`** `string` = the modified string after applying operations specified in `options`
 */
Str.clean = cleaning_1.clean;
/**
 * @param s `string`
 * @param caseOptions {@link StringCaseEnum} = 'upper' | 'lower' | 'title'
 * @returns **`s`** `string` with case option applied
 */
Str.toCase = cleaning_1.applyCaseOptions;
/**
 * @param s `string`
 * @param options {@link StringPadOptions}
 * @param options.side `'left' | 'right' | 'both'`
 * - `left` -> use `s.padStart()`
 * - `right` -> use `s.padEnd()`
 * - `both` -> apply half padding to both sides
 * @returns **`s`** `string` padded to length = `options.maxLength`
 */
Str.pad = cleaning_1.applyPadOptions;
/**
 * @param s `string`
 * @param replaceParams `Array<`{@link StringReplaceParams}`>`
 * @returns **`s`** `string` with replace options applied
 */
Str.replace = cleaning_1.applyReplaceParams;
/**
 * @param s `string`
 * @param options {@link StringStripOptions} = `{ char?: string, left?: StringStripCondition, right?: StringStripCondition }`
 * @returns **`s`**
 */
Str.strip = cleaning_1.applyStripOptions;
