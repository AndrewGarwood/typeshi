/**
 * @file src/utils/regex/stringOperations.ts
 */
import { mainLogger as mlog, INDENT_LOG_LINE as TAB, NEW_LINE as NL} from "../../config";
import { CleanStringOptions, StringCaseOptions, StringReplaceOptions } from ".";
import { RegExpFlagsEnum, StringReplaceParams } from "./types/StringOptions";
import { clean } from "./cleaning";
import { distance as levenshteinDistance } from "fastest-levenshtein";
import { isNonEmptyArray } from "../typeValidation";




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
export function stringEndsWithAnyOf(
    s: string, 
    suffixes: string | string[] | RegExp, 
    ...flags: RegExpFlagsEnum[]
): boolean {
    if (!s || !suffixes) {
        return false;
    }
    let regex = undefined;
    if (typeof suffixes === 'string') {
        suffixes = [suffixes];
    }
    let flagString = (isNonEmptyArray(flags) 
        ? flags.join('') 
        : suffixes instanceof RegExp && suffixes.flags
        ? suffixes.flags 
        : undefined 
    );
    if (Array.isArray(suffixes)) {   
        /** Escape special regex characters in suffixes and join them with '|' (OR) */
        const escapedSuffixes = suffixes.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const pattern = `(${escapedSuffixes.join('|')})\\s*$`;
        regex = new RegExp(pattern, flagString);
    } else if (suffixes instanceof RegExp) {
        regex = (suffixes.source.endsWith('$') 
            ? new RegExp(suffixes, flagString) 
            : new RegExp(suffixes.source + '\\s*$', flagString)
        );
    }

    if (!regex) {
        mlog.error('endsWithAnyOf() Invalid suffixes type. returning false.', 
            'Expected string, array of strings, or RegExp but received:', typeof suffixes, suffixes);
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
export function stringStartsWithAnyOf(
    str: string, 
    prefixes: string | string[] | RegExp, 
    ...flags: RegExpFlagsEnum[]
): boolean {
    if (!str || !prefixes) {
        return false;
    }
    let regex = undefined;
    if (typeof prefixes === 'string') {
        prefixes = [prefixes];
    }
    let flagString = (isNonEmptyArray(flags) 
        ? flags.join('') 
        : prefixes instanceof RegExp && prefixes.flags 
        ? prefixes.flags 
        : undefined
    ); 
    if (Array.isArray(prefixes)) {   
        /** Escape special regex characters in suffixes and join them with '|' (OR) */
        const escapedPrefixes = prefixes.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const pattern = `^\\s*(${escapedPrefixes.join('|')})`;
        regex = new RegExp(pattern, flagString);
    } else if (prefixes instanceof RegExp) {
        regex = (prefixes.source.startsWith('^') 
            ? new RegExp(prefixes, flagString)
            : new RegExp('^\\s*' + prefixes.source, flagString)
        ); 
    }

    if (!regex) {
        mlog.warn(
            'startsWithAnyOf() Invalid prefixes type. returning false.', 
            TAB + 'Expected string, array of strings, or RegExp, but received:', typeof prefixes, 
            TAB + 'prefixes', prefixes
        );
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
export function stringContainsAnyOf(
    str: string, 
    substrings: string | string[] | RegExp, 
    ...flags: RegExpFlagsEnum[]
): boolean {
    if (!str || !substrings) {
        return false;
    }
    let regex = undefined;
    if (typeof substrings === 'string') {
        substrings = [substrings];
    }
    let flagString = (isNonEmptyArray(flags) 
        ? flags.join('') 
        : substrings instanceof RegExp && substrings.flags
        ? substrings.flags 
        : undefined
    );
    if (Array.isArray(substrings)) {   
        /** Escape special regex characters in suffixes and join them with '|' (OR) */
        const escapedSubstrings = substrings.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const pattern = `(${escapedSubstrings.join('|')})`;
        regex = new RegExp(pattern, flagString);
    } else if (substrings instanceof RegExp) {
        regex = new RegExp(substrings, flagString); 
    }

    if (!regex) {
        mlog.warn('containsAnyOf() Invalid substrings type. returning false.', 
        TAB + `Expected string, array of strings, or RegExp, but received: ${typeof substrings}, ${substrings}`);
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
export function equivalentAlphanumericStrings(
    s1: string, 
    s2: string, 
    tolerance: number = 0.90,
): boolean {
    if (!s1 || !s2) return false;
    const cleanOptions = {
        case: { toLower: true } as StringCaseOptions, 
        replace: [
            {searchValue: /[^A-Za-z0-9]/g, replaceValue: '' }
        ] as StringReplaceOptions
    } as CleanStringOptions;
    let s1Alphabetical = clean(s1, cleanOptions).split('').sort().join('');
    let s2Alphabetical = clean(s2, cleanOptions).split('').sort().join('');
    if (s1Alphabetical.length === 0 || s2Alphabetical.length === 0) {
        return false;
    }
    if (s1Alphabetical === s2Alphabetical) { // exact match
        return true;
    } 
    const maxLevenshteinDistance = Math.max(
        Math.floor(s1Alphabetical.length * (1 - tolerance)), 
        Math.floor(s2Alphabetical.length * (1 - tolerance)), 
    );
    if (levenshteinDistance(s1, s2) <= maxLevenshteinDistance
        || levenshteinDistance(s1Alphabetical, s2Alphabetical) <= maxLevenshteinDistance
    ) { 
        return true;
    }
    const s1IncludesTolerableS2 = (s2.length > 0 && s2Alphabetical.length > 0
        && s1Alphabetical.length >= s2Alphabetical.length
        && s2Alphabetical.length / s1Alphabetical.length >= tolerance 
        && s1Alphabetical.includes(s2Alphabetical)
    );
    const s2IncludesTolerableS1 = (s1.length > 0 && s1Alphabetical.length > 0
        && s2Alphabetical.length >= s1Alphabetical.length
        && s1Alphabetical.length / s2Alphabetical.length >= tolerance
        && s2Alphabetical.includes(s1Alphabetical)
    );
    if (s1IncludesTolerableS2 || s2IncludesTolerableS1) { 
        return true;
    }
    return false;
}


/** for simple regular expressions... 
 * so like not ones that have parentheses, pipes, or curly braced numbers */
export function extractSource(
    regex: RegExp
): string {
    if (!regex) return '';
    const REMOVE_ENDPOINT_CHARS: StringReplaceParams = {
        searchValue: /(^(\^|\\b)|(\$|\\b)$)/g, replaceValue: ''
    };
    const REPLACE_ESCAPED_DOT: StringReplaceParams = {
        searchValue: /\\\./g, replaceValue: '.'
    }
    const REPLACE_ESCAPED_WHITESPACE: StringReplaceParams = { // should trim afterwards
        searchValue: /\\\s(\*|\+)?/g, replaceValue: ' '
    }
    const REMOVE_UNESCAPED_QUESTION_MARK: StringReplaceParams = {
        searchValue: /(?<!\\)\?/g, replaceValue: ''
    }
    let source = clean(regex.source, {
        replace: [
            REMOVE_ENDPOINT_CHARS,
            REPLACE_ESCAPED_DOT,
            REPLACE_ESCAPED_WHITESPACE,
            REMOVE_UNESCAPED_QUESTION_MARK
        ]
    })
    
    return source.trim();
}