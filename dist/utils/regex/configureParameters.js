"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPLACE_EM_HYPHEN = exports.ENSURE_SPACE_AROUND_HYPHEN = exports.UNCONDITIONAL_STRIP_DOT_OPTIONS = exports.STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION = void 0;
exports.getCompanyKeywordList = getCompanyKeywordList;
exports.getJobTitleSuffixList = getJobTitleSuffixList;
exports.doesNotEndWithKnownAbbreviation = doesNotEndWithKnownAbbreviation;
/**
 * @file src/utils/regex/configureParameters.ts
 */
const _1 = require(".");
const dataLoader_1 = require("../../config/dataLoader");
// These are now loaded via the dataLoader system
function getCompanyKeywordList() {
    return (0, dataLoader_1.getRegexConstants)().COMPANY_KEYWORD_LIST;
}
function getJobTitleSuffixList() {
    return (0, dataLoader_1.getRegexConstants)().JOB_TITLE_SUFFIX_LIST;
}
/** strip leading `.` and (trailing `.` if satisfy stripRightCondition: {@link doesNotEndWithKnownAbbreviation}) */
/**
 * @param {string} s - `string` - the string to check
 * @returns `!s.endsWith('Ph.D.') && !`{@link stringEndsWithAnyOf}`(s`, {@link COMPANY_ABBREVIATION_PATTERN} as RegExp, `[`{@link RegExpFlagsEnum.IGNORE_CASE}`]) && !stringEndsWithAnyOf(s, /\b[A-Z]\.?\b/, [RegExpFlagsEnum.IGNORE_CASE]);` */
function doesNotEndWithKnownAbbreviation(s) {
    if (!s)
        return false;
    s = s.trim();
    /** matches 1 to 2 occurences of a single letter followed by an optional period */
    const initialsPattern = /\b([A-Z]\.?){1}([A-Z]\.?)?\b/;
    return (!s.endsWith('Ph.D.')
        && !(0, _1.stringEndsWithAnyOf)(s, /\b[A-Z]{2}\.?\b/)
        && !(0, _1.stringEndsWithAnyOf)(s, _1.JOB_TITLE_SUFFIX_PATTERN, _1.RegExpFlagsEnum.IGNORE_CASE)
        && !(0, _1.stringEndsWithAnyOf)(s, _1.COMPANY_ABBREVIATION_PATTERN, _1.RegExpFlagsEnum.IGNORE_CASE)
        && !(0, _1.stringEndsWithAnyOf)(s, initialsPattern, _1.RegExpFlagsEnum.IGNORE_CASE));
}
/** strip leading `.` and (trailing `.` if satisfy stripRightCondition: {@link doesNotEndWithKnownAbbreviation}) */
exports.STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION = {
    char: '.',
    escape: true,
    stripLeftCondition: undefined,
    leftArgs: undefined,
    stripRightCondition: doesNotEndWithKnownAbbreviation,
};
/** always strip leading and trailing `.` from a `string` */
exports.UNCONDITIONAL_STRIP_DOT_OPTIONS = {
    char: '.',
    escape: true,
    stripLeftCondition: undefined,
    leftArgs: undefined,
    stripRightCondition: undefined,
    rightArgs: undefined
};
/**
 * add space around hyphen if it already has one on a single side,
 */
exports.ENSURE_SPACE_AROUND_HYPHEN = {
    searchValue: /( -(?=\S)|(?<=\S)- )/g, replaceValue: ' - '
};
/**
 * replace em hyphen with a regular hyphen
 */
exports.REPLACE_EM_HYPHEN = {
    searchValue: /—/g, replaceValue: '-'
};
