"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPLACE_EM_HYPHEN = exports.ENSURE_SPACE_AROUND_HYPHEN = exports.UNCONDITIONAL_STRIP_DOT_OPTIONS = exports.STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION = exports.RegExpFlagsEnum = exports.JOB_TITLE_SUFFIX_LIST = exports.COMPANY_KEYWORD_LIST = void 0;
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
// For backward compatibility - these will throw an error if accessed before initialization
// This is intentional to help catch usage before proper initialization
exports.COMPANY_KEYWORD_LIST = new Proxy([], {
    get(target, prop) {
        if (prop === 'length' || typeof prop === 'symbol') {
            return getCompanyKeywordList()[prop];
        }
        return getCompanyKeywordList()[prop];
    }
});
exports.JOB_TITLE_SUFFIX_LIST = new Proxy([], {
    get(target, prop) {
        if (prop === 'length' || typeof prop === 'symbol') {
            return getJobTitleSuffixList()[prop];
        }
        return getJobTitleSuffixList()[prop];
    }
});
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
var RegExpFlagsEnum;
(function (RegExpFlagsEnum) {
    RegExpFlagsEnum["IGNORE_CASE"] = "i";
    RegExpFlagsEnum["MULTI_LINE"] = "m";
    RegExpFlagsEnum["GLOBAL"] = "g";
    RegExpFlagsEnum["DOT_MATCHES_NEWLINE"] = "s";
    RegExpFlagsEnum["UNICODE"] = "u";
    RegExpFlagsEnum["STICKY"] = "y";
})(RegExpFlagsEnum || (exports.RegExpFlagsEnum = RegExpFlagsEnum = {}));
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
