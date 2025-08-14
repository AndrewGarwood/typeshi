/**
 * @file src/utils/regex/configureParameters.ts
 */
import { 
    StringStripOptions, StringReplaceParams,
    JOB_TITLE_SUFFIX_PATTERN,
    COMPANY_ABBREVIATION_PATTERN,
    stringEndsWithAnyOf,
    RegExpFlagsEnum, 
} from ".";
import { getRegexConstants } from "../../config/dataLoader";

// These are now loaded via the dataLoader system
export function getCompanyKeywordList(): string[] {
    return getRegexConstants().COMPANY_KEYWORD_LIST;
}

export function getJobTitleSuffixList(): string[] {
    return getRegexConstants().JOB_TITLE_SUFFIX_LIST;
}

/** strip leading `.` and (trailing `.` if satisfy stripRightCondition: {@link doesNotEndWithKnownAbbreviation}) */

/** 
 * @param {string} s - `string` - the string to check
 * @returns `!s.endsWith('Ph.D.') && !`{@link stringEndsWithAnyOf}`(s`, {@link COMPANY_ABBREVIATION_PATTERN} as RegExp, `[`{@link RegExpFlagsEnum.IGNORE_CASE}`]) && !stringEndsWithAnyOf(s, /\b[A-Z]\.?\b/, [RegExpFlagsEnum.IGNORE_CASE]);` */
export function doesNotEndWithKnownAbbreviation(s: string): boolean {
    if (!s) return false;
    s = s.trim();
    /** matches 1 to 2 occurences of a single letter followed by an optional period */
    const initialsPattern = /\b([A-Z]\.?){1}([A-Z]\.?)?\b/;
    return (!s.endsWith('Ph.D.') 
        && !stringEndsWithAnyOf(s, /\b[A-Z]{2}\.?\b/) 
        && !stringEndsWithAnyOf(s, JOB_TITLE_SUFFIX_PATTERN, RegExpFlagsEnum.IGNORE_CASE) 
        && !stringEndsWithAnyOf(s, COMPANY_ABBREVIATION_PATTERN, RegExpFlagsEnum.IGNORE_CASE) 
        && !stringEndsWithAnyOf(s, initialsPattern, RegExpFlagsEnum.IGNORE_CASE)
    );
}

/** strip leading `.` and (trailing `.` if satisfy stripRightCondition: {@link doesNotEndWithKnownAbbreviation}) */
export const STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION: StringStripOptions = {
    char: '.',
    escape: true,
    stripLeftCondition: undefined,
    leftArgs: undefined,
    stripRightCondition: doesNotEndWithKnownAbbreviation,
}

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