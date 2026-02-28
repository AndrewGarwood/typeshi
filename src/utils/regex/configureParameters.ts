/**
 * @file src/utils/regex/configureParameters.ts
 */
import { 
    StringReplaceParams, StringStripOptions,
    JOB_TITLE_SUFFIX_PATTERN,
    COMPANY_ABBREVIATION_PATTERN,
    stringEndsWithAnyOf,
    RegExpFlagsEnum, 
} from ".";

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

/** strip leading `.` and (trailing `.` if satisfy right.condition: {@link doesNotEndWithKnownAbbreviation}) */
export const STRIP_DOT_IF_NOT_ABBREVIATION: StringStripOptions = {
    char: '.',
    left: undefined,
    right: {
        condition: doesNotEndWithKnownAbbreviation
    }
};


export const STRIP_DOT_UNCONDITIONAL: StringStripOptions = {
    char: '.'
};


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