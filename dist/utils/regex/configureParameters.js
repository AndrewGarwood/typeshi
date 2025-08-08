"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPLACE_EM_HYPHEN = exports.ENSURE_SPACE_AROUND_HYPHEN = exports.UNCONDITIONAL_STRIP_DOT_OPTIONS = exports.STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION = void 0;
exports.getCompanyKeywordList = getCompanyKeywordList;
exports.getJobTitleSuffixList = getJobTitleSuffixList;
const dataLoader_1 = require("../../config/dataLoader");
// These are now loaded via the dataLoader system
function getCompanyKeywordList() {
    return (0, dataLoader_1.getRegexConstants)().COMPANY_KEYWORD_LIST;
}
function getJobTitleSuffixList() {
    return (0, dataLoader_1.getRegexConstants)().JOB_TITLE_SUFFIX_LIST;
}
/** strip leading `.` and (trailing `.` if satisfy stripRightCondition: {@link doesNotEndWithKnownAbbreviation}) */
var entity_1 = require("./entity");
Object.defineProperty(exports, "STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION", { enumerable: true, get: function () { return entity_1.STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION; } });
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
