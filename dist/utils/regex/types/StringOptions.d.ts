/**
 * @file src/utils/regex/types/StringOptions.ts
 */
export declare const StringCaseEnum: {
    readonly UPPER: "upper";
    readonly LOWER: "lower";
    readonly TITLE: "title";
};
export type StringCaseEnum = (typeof StringCaseEnum)[keyof typeof StringCaseEnum];
export declare const StringPadEnum: {
    readonly LEFT: "left";
    readonly RIGHT: "right";
    readonly BOTH: "both";
};
export type StringPadEnum = (typeof StringPadEnum)[keyof typeof StringPadEnum];
export interface StringPadOptions {
    maxLength: number;
    /** `default` = `' '` (single space character) */
    char?: string;
    /** `default` = `'left'` (pad left side of string) */
    side?: StringPadEnum;
}
export interface StringCondition {
    condition: (s: string, ...args: any[]) => boolean;
    args?: any[];
}
export type StringStripCondition = StringCondition & {
    /** max number of times to strip char from one side */
    max?: number;
};
export interface StringStripOptions {
    /**
     * `default` = `/\s+/`
     * - will escape special characters if `char` is `string`
     * */
    char?: string | RegExp;
    left?: StringStripCondition;
    right?: StringStripCondition;
}
export interface StringCleanOptions {
    strip?: StringStripOptions;
    case?: StringCaseEnum;
    pad?: StringPadOptions;
    replace?: StringReplaceParams[];
    useDefault?: boolean;
}
export type CleanStringOptions = StringCleanOptions;
/**
 * @typedefn **`StringReplaceOptions`**
 * @property {StringReplaceParams[]} replacements - an array of objects containing `searchValue` and `replaceValue` properties
 */
export type StringReplaceOptions = StringReplaceParams[];
/**
 * @typedefn **`StringReplaceParams`**
 * @property {string | RegExp} searchValue - the string or regular expression to search for in the string
 * @property {string} replaceValue - the string to replace the `searchValue` with
 */
export type StringReplaceParams = {
    searchValue: string | RegExp;
    replaceValue: string;
};
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
/**
 * @typedefn **`CleanStringOptions`**
 */
export type DEP_CleanStringOptions = {
    strip?: DEP_StringStripOptions;
    case?: DEP_StringCaseOptions;
    pad?: DEP_StringPadOptions;
    replace?: StringReplaceOptions;
};
/**
 * @typedefn **`StringCaseOptions`**
 * @property {boolean} [toUpper] - `true` if the string should be converted to upper case
 * @property {boolean} [toLower] - `true` if the string should be converted to lower case
 * @property {boolean} [toTitle] - `true` if the string should be converted to title case, see {@link toTitleCase}
 */
export type DEP_StringCaseOptions = {
    toUpper?: boolean;
    toLower?: boolean;
    toTitle?: boolean;
};
/**
 * @typedefn **`StringPadOptions`**
 * @property {number} padLength - the length of the string after padding
 * @property {string} [padChar] - the character to use for padding, defaults to ' '
 * @property {boolean} [padLeft] - `true` if the padding should be added to the left side of the string
 * @property {boolean} [padRight] - `true` if the padding should be added to the right side of the string
 */
export type DEP_StringPadOptions = {
    padLength: number;
    padChar?: string;
    padLeft?: boolean;
    padRight?: boolean;
};
/**
 * @typedefn **`StringStripOptions`**
 * @property {string} char - the character to strip from the string with {@link applyStripOptions}
 * @property {boolean} [escape] - `true` if the character should be escaped
 * @property {function} [stripLeftCondition] - a function that takes a string and returns `true` if the character should be stripped from the left side of the string
 * @property {any[]} [leftArgs] - arguments to pass to the `stripLeftCondition` function
 * - if `stripLeftCondition(s, leftArgs)` is `true` or `stripLeftCondition` is `undefined` (i.e. no conditions need to be met to strip left), the left side of `s` is stripped of `char`
 * @property {function} [stripRightCondition] - a function that takes a string and returns `true` if the character should be stripped from the right side of the string
 * @property {any[]} [rightArgs] - arguments to pass to the `stripRightCondition` function
 * - if `stripRightCondition(s, rightArgs)` is `true` or `stripRightCondition` is `undefined` (i.e. no conditions need to be met to strip right), the right side of `s` is stripped of `char`
 */
export type DEP_StringStripOptions = {
    char: string;
    escape?: boolean;
    stripLeftCondition?: (s: string, ...args: any[]) => boolean;
    leftArgs?: any[];
    stripRightCondition?: (s: string, ...args: any[]) => boolean;
    rightArgs?: any[];
};
