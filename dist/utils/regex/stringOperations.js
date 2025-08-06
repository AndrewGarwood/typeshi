"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEndsWithAnyOf = stringEndsWithAnyOf;
exports.stringStartsWithAnyOf = stringStartsWithAnyOf;
exports.stringContainsAnyOf = stringContainsAnyOf;
exports.equivalentAlphanumericStrings = equivalentAlphanumericStrings;
exports.extractSource = extractSource;
/**
 * @file src/utils/regex/stringOperations.ts
 */
const config_1 = require("../../config");
const cleaning_1 = require("./cleaning");
const fastest_levenshtein_1 = require("fastest-levenshtein");
const typeValidation_1 = require("../typeValidation");
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
function stringEndsWithAnyOf(s, suffixes, ...flags) {
    if (!s || !suffixes) {
        return false;
    }
    let regex = undefined;
    if (typeof suffixes === 'string') {
        suffixes = [suffixes];
    }
    let flagString = ((0, typeValidation_1.isNonEmptyArray)(flags)
        ? flags.join('')
        : suffixes instanceof RegExp && suffixes.flags
            ? suffixes.flags
            : undefined);
    if (Array.isArray(suffixes)) {
        /** Escape special regex characters in suffixes and join them with '|' (OR) */
        const escapedSuffixes = suffixes.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const pattern = `(${escapedSuffixes.join('|')})\\s*$`;
        regex = new RegExp(pattern, flagString);
    }
    else if (suffixes instanceof RegExp) {
        regex = (suffixes.source.endsWith('$')
            ? new RegExp(suffixes, flagString)
            : new RegExp(suffixes.source + '\\s*$', flagString));
    }
    if (!regex) {
        config_1.mainLogger.error('endsWithAnyOf() Invalid suffixes type. returning false.', 'Expected string, array of strings, or RegExp but received:', typeof suffixes, suffixes);
        return false; // Invalid suffixes type
    }
    return regex.test(s);
}
/**
 * @param str The `string` to check.
 * @param prefixes possible starting string(s).
 * @param flags `Optional` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
 * @returns **`true`** if the string starts with any of the prefixes, **`false`** otherwise.
 */
function stringStartsWithAnyOf(str, prefixes, ...flags) {
    if (!str || !prefixes) {
        return false;
    }
    let regex = undefined;
    if (typeof prefixes === 'string') {
        prefixes = [prefixes];
    }
    let flagString = ((0, typeValidation_1.isNonEmptyArray)(flags)
        ? flags.join('')
        : prefixes instanceof RegExp && prefixes.flags
            ? prefixes.flags
            : undefined);
    if (Array.isArray(prefixes)) {
        /** Escape special regex characters in suffixes and join them with '|' (OR) */
        const escapedPrefixes = prefixes.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const pattern = `^\\s*(${escapedPrefixes.join('|')})`;
        regex = new RegExp(pattern, flagString);
    }
    else if (prefixes instanceof RegExp) {
        regex = (prefixes.source.startsWith('^')
            ? new RegExp(prefixes, flagString)
            : new RegExp('^\\s*' + prefixes.source, flagString));
    }
    if (!regex) {
        config_1.mainLogger.warn('startsWithAnyOf() Invalid prefixes type. returning false.', config_1.INDENT_LOG_LINE + 'Expected string, array of strings, or RegExp, but received:', typeof prefixes, config_1.INDENT_LOG_LINE + 'prefixes', prefixes);
        return false; // Invalid prefixes type
    }
    return regex.test(str);
}
/**
 * @param str The `string` to check.
 * @param substrings possible substring(s).
 * @param flags `Optional` regex flags to use when creating the {@link RegExp} object. see {@link RegExpFlagsEnum}
 * @returns **`true`** if the string contains any of the substrings, **`false`** otherwise.
 */
function stringContainsAnyOf(str, substrings, ...flags) {
    if (!str || !substrings) {
        return false;
    }
    let regex = undefined;
    if (typeof substrings === 'string') {
        substrings = [substrings];
    }
    let flagString = ((0, typeValidation_1.isNonEmptyArray)(flags)
        ? flags.join('')
        : substrings instanceof RegExp && substrings.flags
            ? substrings.flags
            : undefined);
    if (Array.isArray(substrings)) {
        /** Escape special regex characters in suffixes and join them with '|' (OR) */
        const escapedSubstrings = substrings.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const pattern = `(${escapedSubstrings.join('|')})`;
        regex = new RegExp(pattern, flagString);
    }
    else if (substrings instanceof RegExp) {
        regex = new RegExp(substrings, flagString);
    }
    if (!regex) {
        config_1.mainLogger.warn('containsAnyOf() Invalid substrings type. returning false.', config_1.INDENT_LOG_LINE + `Expected string, array of strings, or RegExp, but received: ${typeof substrings}, ${substrings}`);
        return false; // Invalid substrings type
    }
    return regex.test(str);
}
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
function equivalentAlphanumericStrings(s1, s2, tolerance = 0.90) {
    if (!s1 || !s2)
        return false;
    let s1Alphabetical = (0, cleaning_1.clean)(s1, undefined, { toLower: true }, undefined, [{ searchValue: /[^A-Za-z0-9]/g, replaceValue: '' }]).split('').sort().join('');
    let s2Alphabetical = (0, cleaning_1.clean)(s2, undefined, { toLower: true }, undefined, [{ searchValue: /[^A-Za-z0-9]/g, replaceValue: '' }]).split('').sort().join('');
    if (s1Alphabetical.length === 0 || s2Alphabetical.length === 0) {
        return false;
    }
    if (s1Alphabetical === s2Alphabetical) { // exact match
        return true;
    }
    const maxLevenshteinDistance = Math.max(Math.floor(s1Alphabetical.length * (1 - tolerance)), Math.floor(s2Alphabetical.length * (1 - tolerance)));
    if ((0, fastest_levenshtein_1.distance)(s1, s2) <= maxLevenshteinDistance
        || (0, fastest_levenshtein_1.distance)(s1Alphabetical, s2Alphabetical) <= maxLevenshteinDistance) {
        return true;
    }
    const s1IncludesTolerableS2 = (s2.length > 0 && s2Alphabetical.length > 0
        && s1Alphabetical.length >= s2Alphabetical.length
        && s2Alphabetical.length / s1Alphabetical.length >= tolerance
        && s1Alphabetical.includes(s2Alphabetical));
    const s2IncludesTolerableS1 = (s1.length > 0 && s1Alphabetical.length > 0
        && s2Alphabetical.length >= s1Alphabetical.length
        && s1Alphabetical.length / s2Alphabetical.length >= tolerance
        && s2Alphabetical.includes(s1Alphabetical));
    if (s1IncludesTolerableS2 || s2IncludesTolerableS1) {
        return true;
    }
    return false;
}
/** for simple regular expressions...
 * so like not ones that have parentheses, pipes, or curly braced numbers */
function extractSource(regex) {
    if (!regex)
        return '';
    const REMOVE_ENDPOINT_CHARS = {
        searchValue: /(^(\^|\\b)|(\$|\\b)$)/g, replaceValue: ''
    };
    const REPLACE_ESCAPED_DOT = {
        searchValue: /\\\./g, replaceValue: '.'
    };
    const REPLACE_ESCAPED_WHITESPACE = {
        searchValue: /\\\s(\*|\+)?/g, replaceValue: ' '
    };
    const REMOVE_UNESCAPED_QUESTION_MARK = {
        searchValue: /(?<!\\)\?/g, replaceValue: ''
    };
    let source = (0, cleaning_1.clean)(regex.source, {
        replace: [
            REMOVE_ENDPOINT_CHARS,
            REPLACE_ESCAPED_DOT,
            REPLACE_ESCAPED_WHITESPACE,
            REMOVE_UNESCAPED_QUESTION_MARK
        ]
    });
    return source.trim();
}
