"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean = clean;
exports.toTitleCase = toTitleCase;
exports.applyReplaceOptions = applyReplaceOptions;
exports.applyCaseOptions = applyCaseOptions;
exports.applyPadOptions = applyPadOptions;
exports.applyStripOptions = applyStripOptions;
/**
 * @file src/utils/regex/cleaning.ts
 */
const config_1 = require("../../config");
const typeValidation_1 = require("../typeValidation");
const typeGuards_1 = require("./types/typeGuards");
function clean(s, arg2, arg3, arg4, arg5) {
    if (!s)
        return '';
    const { strip: stripOptions, case: caseOptions, pad: padOptions, replace: replaceOptions } = ((0, typeGuards_1.isCleanStringOptions)(arg2)
        ? arg2
        : {
            strip: arg2,
            case: arg3,
            pad: arg4,
            replace: arg5
        });
    s = String(s).trim() || '';
    s = s.replace(/\s+/g, ' ').replace(/\.{2,}/g, '.').replace(/,{2,}/g, ',');
    if ((0, typeValidation_1.isNonEmptyArray)(replaceOptions)) {
        s = applyReplaceOptions(s, replaceOptions);
    }
    if (stripOptions) {
        s = applyStripOptions(s, stripOptions);
    }
    if (caseOptions) {
        s = applyCaseOptions(s, caseOptions);
    }
    if (padOptions && padOptions.padLength) {
        s = applyPadOptions(s, padOptions);
    }
    return s.trim().replace(/,$/g, '');
}
/**
 * @param s `string` - the string to convert to title case
 * @returns **`s`** `string` - the string in title case
 * (i.e. first letter of each word, determined by the `\b` boundary metacharacter, is capitalized)
 */
function toTitleCase(s) {
    if (!s)
        return '';
    return s
        .replace(/\b\w/g, char => char.toUpperCase())
        .replace(/(?<=\b[A-Z]{1})\w*\b/g, char => char.toLowerCase());
}
/**
 * @TODO convert
 * `s = s.replace(/\s+/g, ' ').replace(/\.{2,}/g, '.').replace(/,{2,}/g, ',');`
 * to StringReplaceOptions and test to ensure consistent output
 * */
const CLEAN_BASIC_REPLACE_OPTIONS = [];
/**
 * @param s `string`
 * @param replaceOptions `Array<`{@link StringReplaceParams}`>`
 * @returns **`s`** `string` with replace options applied
 */
function applyReplaceOptions(s, replaceOptions) {
    if (!(0, typeValidation_1.isNonEmptyArray)(replaceOptions))
        return s;
    for (const params of replaceOptions) {
        let initialValue = s;
        // Reset regex state if it's a global regex to avoid stateful issues
        if (params.searchValue instanceof RegExp && params.searchValue.global) {
            params.searchValue.lastIndex = 0;
        }
        s = initialValue.replace(params.searchValue, params.replaceValue);
    }
    return s;
}
/**
 * @param s `string` - the string to handle case options for
 * @param caseOptions — {@link StringCaseOptions} - `optional` case options to apply to the string
 * = `{ toUpper: boolean, toLower: boolean, toTitle: boolean }`
 * - applies the first case option that is `true` and ignores the rest
 * @returns **`s`** - the string with case options applied
 */
function applyCaseOptions(s, caseOptions = { toUpper: false, toLower: false, toTitle: false }) {
    if (!s)
        return '';
    const { toUpper, toLower, toTitle } = caseOptions;
    if (toUpper) {
        s = s.toUpperCase();
    }
    else if (toLower) {
        s = s.toLowerCase();
    }
    else if (toTitle) {
        s = toTitleCase(s);
    }
    return s;
}
/**
 * @param s `string` - the string to handle padding options for
 * @param padOptions — {@link StringPadOptions} - `optional` padding options to apply to the string
 * = `{ padLength: number, padChar: string, padLeft: boolean, padRight: boolean }`
 * - applies the first padding option that is `true` and ignores the rest
 * @returns **`s`** - the string with padding options applied
 * @note `if` `s.length >= padLength`, no padding is applied
 */
function applyPadOptions(s, padOptions = { padLength: 24, padChar: ' ', padLeft: false, padRight: false }) {
    if (!s)
        return '';
    const { padLength, padChar, padLeft, padRight } = padOptions;
    if (typeof padLength !== 'number' || padLength < 0) {
        config_1.mainLogger.warn('handlePadOptions() Invalid padLength. Expected a positive integer, but received:', padLength);
        return s;
    }
    if (s.length >= padLength) {
        return s; // No padding needed
    }
    if (padLeft) {
        s = s.padStart(padLength, padChar);
    }
    else if (padRight) {
        s = s.padEnd(padLength, padChar);
    }
    return s;
}
/**
 * @param s `string`
 * @param stripOptions — {@link StringStripOptions}
 * = `{ char: string, escape?: boolean, stripLeftCondition?: (s: string, ...args: any[]) => boolean, leftArgs?: any[], stripRightCondition?: (s: string, ...args: any[]) => boolean, rightArgs?: any[] }`
 * - if `stripLeftCondition(s, leftArgs)` is `true` or `stripLeftCondition` is `undefined` (i.e. no conditions need to be met to strip left):
 * - - then the left side of the `s` is stripped of `char`
 * - if `stripRightCondition(s, rightArgs)` is `true` or `stripRightCondition` is `undefined` (i.e. no conditions need to be met to strip right):
 * - - then the right side of the `s` is stripped of `char`
 * @param stripOptions.escape escape special regex characters in `char` with `char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`
 * @returns `string` - the string with leading and trailing characters removed
 */
function applyStripOptions(s, stripOptions) {
    if (!s)
        return '';
    let { char, escape = false, stripLeftCondition = false, leftArgs, stripRightCondition = false, rightArgs } = stripOptions;
    if (escape) {
        char = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    let regexSource = '';
    const leftSideUnconditionalOrMeetsCondition = !stripLeftCondition || (stripLeftCondition && stripLeftCondition(s, leftArgs));
    const rightSideUnconditionalOrMeetsCondition = !stripRightCondition || (stripRightCondition && stripRightCondition(s, rightArgs));
    if (leftSideUnconditionalOrMeetsCondition) {
        regexSource = regexSource + `^${char}+`;
    }
    if (regexSource.length > 0) {
        regexSource = regexSource + '|';
    }
    if (rightSideUnconditionalOrMeetsCondition) {
        regexSource = regexSource + `${char}+$`;
    }
    if (!stripLeftCondition && !stripRightCondition) { // assume strip both sides
        regexSource = `^${char}+|${char}+$`;
    }
    const regex = new RegExp(regexSource, 'g');
    return s.replace(regex, '');
}
