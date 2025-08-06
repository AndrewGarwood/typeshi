/**
 * @file src/utils/regex/configureParameters.ts
 */
import { StringStripOptions, StringReplaceParams } from "./types";
export declare function getCompanyKeywordList(): string[];
export declare function getJobTitleSuffixList(): string[];
export declare const COMPANY_KEYWORD_LIST: string[];
export declare const JOB_TITLE_SUFFIX_LIST: string[];
/**
 * @reference {@link https://javascript.info/regexp-introduction}
 * @enum {string} **`RegExpFlagsEnum`**
 * @property {string} IGNORE_CASE - `i` - case insensitive "the search is case-insensitive: no difference between `A` and `a`"
 * @property {string} MULTI_LINE - `m` - multi-line "Multiline mode" see {@link https://javascript.info/regexp-multiline-mode}
 * @property {string} GLOBAL - `g` - global search "With this flag the search looks for all matches, without it – only the first match is returned."
 * @property {string} DOT_MATCHES_NEWLINE - `s` - dot matches newline "By default, a dot doesn’t match the newline character `n`."
 * @property {string} UNICODE - `u` - unicode "Enables full Unicode support. The flag enables correct processing of surrogate pairs." see {@link https://javascript.info/regexp-unicode}
 * @property {string} STICKY - `y` - sticky search "searching at the exact position in the text." see {@link https://javascript.info/regexp-sticky}
 */
export declare enum RegExpFlagsEnum {
    IGNORE_CASE = "i",
    MULTI_LINE = "m",
    GLOBAL = "g",
    DOT_MATCHES_NEWLINE = "s",
    UNICODE = "u",
    STICKY = "y"
}
/** strip leading `.` and (trailing `.` if satisfy stripRightCondition: {@link doesNotEndWithKnownAbbreviation}) */
export { STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION } from "./entity";
/** always strip leading and trailing `.` from a `string` */
export declare const UNCONDITIONAL_STRIP_DOT_OPTIONS: StringStripOptions;
/**
 * add space around hyphen if it already has one on a single side,
 */
export declare const ENSURE_SPACE_AROUND_HYPHEN: StringReplaceParams;
/**
 * replace em hyphen with a regular hyphen
 */
export declare const REPLACE_EM_HYPHEN: StringReplaceParams;
