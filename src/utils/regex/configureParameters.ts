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