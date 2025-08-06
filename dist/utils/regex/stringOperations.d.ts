import { RegExpFlagsEnum } from "./configureParameters";
/**
 * Checks if a string ends with any of the specified suffixes.
 * @param s The `string` to check.
 * @param suffixes An array of possible ending strings.
 * @param flags `Optional` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
 * @returns **`true`** if the string ends with any of the suffixes, **`false`** otherwise.
 * @example
 * const myString = "hello world";
 * const possibleEndings = ["world", "universe", "planet"];
 * console.log(endsWithAny(myString, possibleEndings)); // Output: true
 * const anotherString = "goodbye moon";
 * console.log(endsWithAny(anotherString, possibleEndings)); // Output: false
 */
export declare function stringEndsWithAnyOf(s: string, suffixes: string | string[] | RegExp, ...flags: RegExpFlagsEnum[]): boolean;
/**
 * @param str The `string` to check.
 * @param prefixes possible starting string(s).
 * @param flags `Optional` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
 * @returns **`true`** if the string starts with any of the prefixes, **`false`** otherwise.
 */
export declare function stringStartsWithAnyOf(str: string, prefixes: string | string[] | RegExp, ...flags: RegExpFlagsEnum[]): boolean;
/**
 * @param str The `string` to check.
 * @param substrings possible substring(s).
 * @param flags `Optional` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
 * @returns **`true`** if the string contains any of the substrings, **`false`** otherwise.
 */
export declare function stringContainsAnyOf(str: string, substrings: string | string[] | RegExp, ...flags: RegExpFlagsEnum[]): boolean;
/**
 * @consideration add parameter to ignore case. currently:
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
export declare function equivalentAlphanumericStrings(s1: string, s2: string, tolerance?: number): boolean;
/** for simple regular expressions...
 * so like not ones that have parentheses, pipes, or curly braced numbers */
export declare function extractSource(regex: RegExp): string;
