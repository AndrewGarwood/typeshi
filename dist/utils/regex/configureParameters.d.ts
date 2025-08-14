/**
 * @file src/utils/regex/configureParameters.ts
 */
import { StringStripOptions, StringReplaceParams } from ".";
export declare function getCompanyKeywordList(): string[];
export declare function getJobTitleSuffixList(): string[];
/** strip leading `.` and (trailing `.` if satisfy stripRightCondition: {@link doesNotEndWithKnownAbbreviation}) */
/**
 * @param {string} s - `string` - the string to check
 * @returns `!s.endsWith('Ph.D.') && !`{@link stringEndsWithAnyOf}`(s`, {@link COMPANY_ABBREVIATION_PATTERN} as RegExp, `[`{@link RegExpFlagsEnum.IGNORE_CASE}`]) && !stringEndsWithAnyOf(s, /\b[A-Z]\.?\b/, [RegExpFlagsEnum.IGNORE_CASE]);` */
export declare function doesNotEndWithKnownAbbreviation(s: string): boolean;
/** strip leading `.` and (trailing `.` if satisfy stripRightCondition: {@link doesNotEndWithKnownAbbreviation}) */
export declare const STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION: StringStripOptions;
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
