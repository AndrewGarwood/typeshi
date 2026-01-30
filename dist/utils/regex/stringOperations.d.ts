import { RegExpFlagsEnum } from "./types/StringOptions";
/**
 * Checks if a string ends with any of the specified suffixes.
 * @param s `string`
 * @param suffixes `string | string[] | RegExp` possible ending strings.
 * @param flags `RegExpFlagsEnum[] (Optional)` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
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
 * @param s `string`
 * @param prefixes `string | string[] | RegExp` possible starting string(s).
 * @param flags `RegExpFlagsEnum[] (Optional)` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
 * @returns **`true`** if the string starts with any of the prefixes, **`false`** otherwise.
 */
export declare function stringStartsWithAnyOf(s: string, prefixes: string | string[] | RegExp, ...flags: RegExpFlagsEnum[]): boolean;
/**
 * @param s `string` to check.
 * @param substrings `string | string[] | RegExp`.
 * @param flags `RegExpFlagsEnum[] (Optional)` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
 * @returns **`true`** if the string contains any of the substrings, **`false`** otherwise.
 */
export declare function stringContainsAnyOf(s: string, substrings: string | string[] | RegExp, ...flags: RegExpFlagsEnum[]): boolean;
/**
 * @consideration add parameter to ignore case. Currently ignores case by default:
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
export declare namespace Str {
    /**
     * @param s `string`
     * @param prefixes `string | string[] | RegExp` possible starting string(s).
     * @param flags `RegExpFlagsEnum[] (Optional)` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
     * @returns **`true`** if the string starts with any of the prefixes, **`false`** otherwise.
     */
    const startsWith: typeof stringStartsWithAnyOf;
    /**
     * Checks if a string ends with any of the specified suffixes.
     * @param s `string`
     * @param suffixes `string | string[] | RegExp` possible ending strings.
     * @param flags `RegExpFlagsEnum[] (Optional)` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
     * @returns **`true`** if the string ends with any of the suffixes, **`false`** otherwise.
     */
    const endsWith: typeof stringEndsWithAnyOf;
    /**
     * @param s `string`
     * @param substrings `string | string[] | RegExp`
     * @param flags `RegExpFlagsEnum[] (Optional)` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
     * @returns **`true`** if the string contains any of the substrings, **`false`** otherwise.
     */
    const contains: typeof stringContainsAnyOf;
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
    const equivalentAlphanumeric: typeof equivalentAlphanumericStrings;
}
/** for simple regular expressions...
 * so like not ones that have parentheses, pipes, or curly braced numbers */
export declare function extractSource(regex: RegExp): string;
