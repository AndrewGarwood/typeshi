/**
 * @file src/utils/regex/configureParameters.ts
 */
import { 
    StringStripOptions, StringReplaceParams, 
} from "./types";
import { getRegexConstants } from "../../config/dataLoader";

// These are now loaded via the dataLoader system
export function getCompanyKeywordList(): string[] {
    return getRegexConstants().COMPANY_KEYWORD_LIST;
}

export function getJobTitleSuffixList(): string[] {
    return getRegexConstants().JOB_TITLE_SUFFIX_LIST;
}

// For backward compatibility - these will throw an error if accessed before initialization
// This is intentional to help catch usage before proper initialization
export const COMPANY_KEYWORD_LIST = new Proxy([], {
    get(target, prop) {
        if (prop === 'length' || typeof prop === 'symbol') {
            return getCompanyKeywordList()[prop as keyof string[]];
        }
        return getCompanyKeywordList()[prop as keyof string[]];
    }
}) as string[];

export const JOB_TITLE_SUFFIX_LIST = new Proxy([], {
    get(target, prop) {
        if (prop === 'length' || typeof prop === 'symbol') {
            return getJobTitleSuffixList()[prop as keyof string[]];
        }
        return getJobTitleSuffixList()[prop as keyof string[]];
    }
}) as string[];

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
export enum RegExpFlagsEnum {
    IGNORE_CASE = 'i',
    MULTI_LINE = 'm',
    GLOBAL = 'g',
    DOT_MATCHES_NEWLINE = 's',
    UNICODE = 'u',
    STICKY = 'y'
}

/** strip leading `.` and (trailing `.` if satisfy stripRightCondition: {@link doesNotEndWithKnownAbbreviation}) */
export { STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION } from "./entity";

/** always strip leading and trailing `.` from a `string` */
export const UNCONDITIONAL_STRIP_DOT_OPTIONS: StringStripOptions = {
    char: '.',
    escape: true,
    stripLeftCondition: undefined,
    leftArgs: undefined,
    stripRightCondition: undefined,
    rightArgs: undefined
}


/**
 * add space around hyphen if it already has one on a single side, 
 */
export const ENSURE_SPACE_AROUND_HYPHEN: StringReplaceParams = { 
    searchValue: /( -(?=\S)|(?<=\S)- )/g, replaceValue: ' - ' 
};
/**
 * replace em hyphen with a regular hyphen
 */
export const REPLACE_EM_HYPHEN: StringReplaceParams = { 
    searchValue: /—/g, replaceValue: '-' 
};