import { StringReplaceOptions, StringStripOptions, StringReplaceParams } from ".";
/** `re` = /`^\s*((attention|attn|atn):)?\s*((Mr|Ms|Mrs|Dr|Prof)\.?)*\s*`/`i` */
export declare const ATTN_SALUTATION_PREFIX_PATTERN: RegExp;
/** `re` = /`^(Mr\.|Ms\.|Mrs\.|Dr\.|Mx\.)`/`i` */
export declare const SALUTATION_REGEX: RegExp;
/** `re` = /`^[A-Z]{1}\.?$`/i */
export declare const MIDDLE_INITIAL_REGEX: RegExp;
/** `re` = `/((([A-Z]\.){1})*|([A-Z]{1,4}(\.|-)?)){asterisk}/` */
export declare const CREDENTIAL_PATTERN: RegExp;
/**
 * `re` = `/^\s*([A-Za-z'-]{2,})\s*,\s*(?:(?:[A-Z]{1,4}\.?\,?\s*)+)?([A-Za-z'-]+(?:\s+[A-Za-z.'-]+)*)\s*$/`
 */
export declare const LAST_NAME_COMMA_FIRST_NAME_PATTERN: RegExp;
export declare const REMOVE_ATTN_SALUTATION_PREFIX: StringReplaceParams;
export declare function getJobTitleSuffixPattern(): RegExp;
/**
 * `re` = `/((, ?| )(MSPA|APRN|BSN|FNP-C|LME|DDS|DOO|Ph\.?D\.|MSN-RN|R\.?N|N\.?P|CRNA|FAAD|FNP|P.?A.?C|PA-C|PA|DMD|NMD|MD|M\.D|DO|L\.?E\.?|CMA|CANS|O.?M|Frcs|FRCS|FACS|FAC)\.?,?)+/g`
 * */
export declare const JOB_TITLE_SUFFIX_PATTERN: RegExp;
export declare const REMOVE_JOB_TITLE_SUFFIX: StringReplaceParams;
/**
 * - {@link REMOVE_ATTN_SALUTATION_PREFIX}
 * - {@link REMOVE_JOB_TITLE_SUFFIX}
 * - remove trailing comma
 */
export declare const CLEAN_NAME_REPLACE_OPTIONS: StringReplaceOptions;
/**
 * **if** `name` contains a digit or contains any of {@link COMPANY_KEYWORDS_PATTERN} or `/[0-9!#&@]/`,
 * - `then` do not attempt to extract name and return empty strings
 * @param name `string` - the full name from which to extract 3 parts: the first, middle, and last names
 * @returns `{first: string, middle?: string, last?: string}` - the first, middle, and last names
 * @example
 * let name = 'John Doe';
 * console.log(extractName(name)); // { first: 'John', middle: '', last: 'Doe' }
 * name = 'John A. Doe';
 * console.log(extractName(name)); // { first: 'John', middle: 'A.', last: 'Doe' }
 */
export declare function extractName(name: string, includeJobTitleSuffix?: boolean): {
    first: string;
    middle?: string;
    last?: string;
};
/**
 * - {@link JOB_TITLE_SUFFIX_PATTERN}
 *
 * Cases to consider for input param `s`: (want to extract JOB_TITLE)
 * - `s` = `"lastName, {JOB_TITLE}"`
 * - `s` = `"firstName lastName, {JOB_TITLE}"`
 * - `s` = `"firstName middleName lastName, {JOB_TITLE}"`
 * - `s` = `"firstName middleInitial lastName, {JOB_TITLE}"`
 * - `s` = `"lastName, {JOB_TITLE}, firstName"` // matches {@link LAST_NAME_COMMA_FIRST_NAME_PATTERN}
 * @param s `string`
 * @returns **`jobTitle`** `string` - the job title, if it exists
 */
export declare function extractJobTitleSuffix(s: string): string;
/**
 * - `re` = `/\b(?:company|corp|inc|co\.?,? ltd\.?|ltd|\.?l\.?lc|plc . . .)\b/` `i`
 * */
export declare const COMPANY_KEYWORDS_PATTERN: RegExp;
export declare const COMPANY_ABBREVIATION_PATTERN: RegExp;
/**
 * @param {string} s - `string` - the string to check
 * @returns `!s.endsWith('Ph.D.') && !`{@link stringEndsWithAnyOf}`(s`, {@link COMPANY_ABBREVIATION_PATTERN} as RegExp, `[`{@link RegExpFlagsEnum.IGNORE_CASE}`]) && !stringEndsWithAnyOf(s, /\b[A-Z]\.?\b/, [RegExpFlagsEnum.IGNORE_CASE]);` */
export declare function doesNotEndWithKnownAbbreviation(s: string): boolean;
/** strip leading `.` and (trailing `.` if satisfy stripRightCondition: {@link doesNotEndWithKnownAbbreviation}) */
export declare const STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION: StringStripOptions;
