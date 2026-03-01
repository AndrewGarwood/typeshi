"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean = clean;
exports.applyStripOptions = applyStripOptions;
exports.applyReplaceParams = applyReplaceParams;
exports.applyPadOptions = applyPadOptions;
exports.applyCaseOptions = applyCaseOptions;
exports.toTitleCase = toTitleCase;
/**
 * @file src/utils/regex/cleaning.ts
 */
const config_1 = require("../../config");
const typeValidation_1 = require("../typeValidation");
const types_1 = require("./types");
/**
 * @param s `string`
 * @param options {@link StringCleanOptions} `(optional)`
 * @param options.useDefault `boolean (optional)` `default` = `true`
 * - `if true` - calls `s.trim()` and replaces `/\s{2,}/g` with single space, `/\.{2,}/g` with single period, and `/,{2,}/g` with single comma
 * *before* proceeding with remaining operations
 * @returns **`s`** `string` = the modified string after applying operations specified in `options`
 */
function clean(s, options) {
    if (!s)
        return '';
    if (options && !(0, types_1.isStringCleanOptions)(options)) {
        config_1.typeshiLogger.error(`[Str.clean()] Invalid argument 'options' (StringCleanOptions), returning unaltered string...`);
        return s;
    }
    const { strip: stripOptions, case: caseOptions, pad: padOptions, replace: replaceOptions, useDefault } = options ? options : {
        strip: undefined,
        case: undefined,
        pad: undefined,
        replace: undefined,
        useDefault: true
    };
    if (useDefault) {
        s = (String(s)
            .trim()
            .replace(/\s{2,}/g, ' ')
            .replace(/\.{2,}/g, '.')
            .replace(/,{2,}/g, ','));
    }
    if ((0, typeValidation_1.isNonEmptyArray)(replaceOptions)) {
        s = applyReplaceParams(s, replaceOptions);
    }
    if (stripOptions) {
        s = applyStripOptions(s, stripOptions);
    }
    if (caseOptions) {
        s = applyCaseOptions(s, caseOptions);
    }
    if (padOptions) {
        s = applyPadOptions(s, padOptions);
    }
    return s;
}
/**
 * @param s `string`
 * @param options {@link StringStripOptions} = `{ char?: string, left?: StringStripCondition, right?: StringStripCondition }`
 * @returns **`s`**
 */
function applyStripOptions(s, options) {
    const original = s;
    try {
        let { char, left, right } = options;
        if ((0, typeValidation_1.isNonEmptyString)(char)) {
            char = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        char = !char ? ' ' : char instanceof RegExp ? char.source : char;
        let stripLeft = !left || left.condition(s, ...(left.args || []));
        let stripRight = !right || right.condition(s, ...(right.args || []));
        let re;
        if (stripLeft) {
            if (left && (0, typeValidation_1.isPositveInteger)(left.max)) {
                re = new RegExp(`^(${char})`);
                let count = 0;
                while (re.test(s) && count <= left.max) {
                    s = s.replace(re, '');
                    count++;
                }
            }
            else {
                re = new RegExp(`^(${char})+`);
                s = s.replace(re, '');
            }
        }
        if (stripRight) {
            if (right && (0, typeValidation_1.isPositveInteger)(right.max)) {
                re = new RegExp(`(${char})$`);
                let count = 0;
                while (re.test(s) && count <= right.max) {
                    s = s.replace(re, '');
                    count++;
                }
            }
            else {
                re = new RegExp(`(${char})+$`);
                s = s.replace(re, '');
            }
        }
        return s;
    }
    catch (error) {
        config_1.typeshiLogger.error([`[Str.applyStripOptions()] Unknown Error Occurred, returning original string`,
            `error: ${error}`
        ].join(config_1.INDENT_LOG_LINE));
        return original;
    }
}
/**
 * @param s `string`
 * @param replaceParams `Array<`{@link StringReplaceParams}`>`
 * @returns **`s`** `string` with replace options applied
 */
function applyReplaceParams(s, replaceParams) {
    if (!(0, typeValidation_1.isNonEmptyArray)(replaceParams))
        return s;
    for (const params of replaceParams) {
        let initialValue = s;
        // Reset regex state if it's a global regex to avoid stateful issues
        if (params.searchValue instanceof RegExp && params.searchValue.global) {
            params.searchValue.lastIndex = 0;
        }
        s = initialValue.replace(params.searchValue, params.replaceValue).trim();
    }
    return s;
}
/**
 * @param s `string`
 * @param options {@link StringPadOptions}
 * @param options.side `'left' | 'right' | 'both'`
 * - `left` -> use `s.padStart()`
 * - `right` -> use `s.padEnd()`
 * - `both` -> apply half padding to both sides
 * @returns **`s`** `string` padded to length = `options.maxLength`
 */
function applyPadOptions(s, options) {
    if (!s)
        s = '';
    let { maxLength, char = ' ', side = 'both' } = options;
    switch (side) {
        case 'left':
            return s.padStart(maxLength, char);
        case 'right':
            return s.padEnd(maxLength, char);
        case 'both':
            let paddingNeeded = maxLength - s.length;
            s = s.padStart(s.length + paddingNeeded / 2, char);
            s = s.padEnd(maxLength, char);
            return s;
        default:
            config_1.typeshiLogger.error([`[applyPadOptions()] Invalid argument 'options.side'`,
                `Expected: 'left' | 'right' | 'both'`,
                `Received: '${side}'`,
                `Returing unaltered string...`
            ].join(config_1.INDENT_LOG_LINE));
            return s;
    }
}
/**
 * @param s `string`
 * @param caseOptions {@link StringCaseEnum} = `'upper' | 'lower' | 'title'`
 * @returns **`s`** `string` with case option applied
 */
function applyCaseOptions(s, caseOptions) {
    if (!s)
        return '';
    switch (caseOptions) {
        case types_1.StringCaseEnum.UPPER:
            return s.toUpperCase();
        case types_1.StringCaseEnum.LOWER:
            return s.toLowerCase();
        case types_1.StringCaseEnum.TITLE:
            return toTitleCase(s);
        default:
            config_1.typeshiLogger.warn([
                '[applyCaseOptions()] Unsupported case option. Returning original string.',
                `Expected: 'upper' | 'lower' | 'title'`,
                `Received: '${caseOptions}'`
            ].join(config_1.INDENT_LOG_LINE));
            return s;
    }
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
