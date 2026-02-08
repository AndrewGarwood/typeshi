/**
 * @file src/utils/regex/cleaning.ts
 */
import { typeshiLogger as mlog, INDENT_LOG_LINE as TAB, NEW_LINE as NL } from "../../config";
import { isNonEmptyArray, isNonEmptyString, isPositveInteger } from "../typeValidation";
import { 
    DEP_CleanStringOptions, DEP_isCleanStringOptions, DEP_StringCaseOptions, DEP_StringPadOptions, StringCaseEnum,
    StringPadOptions, StringReplaceOptions, DEP_StringStripOptions, StringPadEnum, StringCleanOptions, StringReplaceParams, StringStripOptions,
    isStringCleanOptions
} from "./types";


/**
 * @param s `string`
 * @param options {@link StringCleanOptions} `(optional)`
 * @param options.useDefault `boolean (optional)` `default` = `true`
 * - `if true` - calls `s.trim()` and replaces `/\s{2,}/g` with single space, `/\.{2,}/g` with single period, and `/,{2,}/g` with single comma
 * *before* proceeding with remaining operations
 * @returns **`s`** `string` = the modified string after applying operations specified in `options`
 */
export function clean(s: string, options?: StringCleanOptions): string {
    if (!s) return '';
    if (options && !isStringCleanOptions(options)) {
        mlog.error(`[Str.clean()] Invalid argument 'options' (StringCleanOptions), returning unaltered string...`);
        return s;
    }
    const { 
        strip: stripOptions, case: caseOptions, pad: padOptions, replace: replaceOptions, useDefault 
    } = options ? options : {
        strip: undefined,
        case: undefined,
        pad: undefined,
        replace: undefined,
        useDefault: true
    } as StringCleanOptions
    if (useDefault) {
        s = (String(s)
            .trim()
            .replace(/\s{2,}/g, ' ')
            .replace(/\.{2,}/g, '.')
            .replace(/,{2,}/g, ',')
        );
    }
    if (isNonEmptyArray<StringReplaceParams>(replaceOptions)) {
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
export function applyStripOptions(s: string, options: StringStripOptions): string {
    const original = s;
    try {
        let { char, left, right } = options;
        if (isNonEmptyString(char)) {
            char = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        char = !char ? ' ' : char instanceof RegExp ? char.source : char;
        let stripLeft = !left || left.condition(s, ...(left.args || []));
        let stripRight = !right || right.condition(s, ...(right.args || []));
        let re: RegExp;
        if (stripLeft) {
            if (left && isPositveInteger(left.max)) {
                re = new RegExp(`^(${char})`);
                let count = 0;
                while (re.test(s) && count <= left.max) {
                    s = s.replace(re, '');
                    count++;
                }
            } else {
                re = new RegExp(`^(${char})+`);
                s = s.replace(re, '');
            }
        }
        if (stripRight) {
            if (right && isPositveInteger(right.max)) {
                re = new RegExp(`(${char})$`);
                let count = 0;
                while (re.test(s) && count <= right.max) {
                    s = s.replace(re, '');
                    count++;
                }
            } else {
                re = new RegExp(`(${char})+$`);
                s = s.replace(re, '');
            }
        }
        return s;
    } catch (error: any) {
        mlog.error([`[Str.applyStripOptions()] Unknown Error Occurred, returning original string`,
            `error: ${error}`
        ].join(TAB));
        return original;
    }
}

/**
 * @param s `string`
 * @param replaceParams `Array<`{@link StringReplaceParams}`>`
 * @returns **`s`** `string` with replace options applied
 */
export function applyReplaceParams(s: string, replaceParams: StringReplaceParams[]): string {
    if (!isNonEmptyArray(replaceParams)) return s
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
export function applyPadOptions(s: string, options: StringPadOptions): string {
    if (!s) s = '';
    let { maxLength, char = ' ', side = 'both'} = options;
    switch (side) {
        case 'left':
            return s.padStart(maxLength, char);
        case 'right':
            return s.padEnd(maxLength, char);
        case 'both':
            let paddingNeeded = maxLength - s.length;
            s = s.padStart(s.length +  paddingNeeded / 2, char);
            s = s.padEnd(maxLength, char);
            return s;
        default:
            mlog.error([`[Str.applyPadOptions()] Invalid argument 'options.side'`,
                `Expected: 'left' | 'right' | 'both'`,
                `Received: '${side}'`,
                `Returing unaltered string...`
            ].join(TAB))
            return s;
    }
}

/**
 * @param s `string` 
 * @param caseOptions {@link StringCaseEnum} = `'upper' | 'lower' | 'title'` 
 * @returns **`s`** `string` with case option applied
 */
export function applyCaseOptions(s: string, caseOptions: StringCaseEnum): string {
    if (!s) return '';
    switch (caseOptions) {
        case StringCaseEnum.UPPER:
            return s.toUpperCase();
        case StringCaseEnum.LOWER:
            return s.toLowerCase();
        case StringCaseEnum.TITLE:
            return toTitleCase(s);
        default:
            mlog.warn([
                '[applyCase()] Invalid case option. Returning original string.', 
                `Expected one of: ${Object.values(StringCaseEnum).join(', ')}`, 
                `Received: ${caseOptions}`
            ].join(TAB));
            return s;
    }
}

/**
 * @deprecated
 * @param s `string` - the string to handle padding options for
 * @param padOptions — {@link StringPadOptions} - `optional` padding options to apply to the string
 * = `{ padLength: number, padChar: string, padLeft: boolean, padRight: boolean }`
 * - applies the first padding option that is `true` and ignores the rest
 * @returns **`s`** - the string with padding options applied
 * @note `if` `s.length >= padLength`, no padding is applied
 */
export function DEP_applyPadOptions(
    s: string,
    padOptions: DEP_StringPadOptions = { padLength: 24, padChar: ' ', padLeft: false, padRight: false }
): string {
    if (!s) return '';
    const { padLength, padChar, padLeft, padRight } = padOptions;
    if (typeof padLength !== 'number' || padLength < 0) {
        mlog.warn('handlePadOptions() Invalid padLength. Expected a positive integer, but received:', padLength);
        return s;
    }
    if (s.length >= padLength) {
        return s; // No padding needed
    }
    if (padLeft) {
        s = s.padStart(padLength, padChar);
    } else if (padRight) {
        s = s.padEnd(padLength, padChar);
    }
    return s;
}

/**
 * @param s `string`
 * @param stripOptions — {@link DEP_StringStripOptions} 
 * = `{ char: string, escape?: boolean, stripLeftCondition?: (s: string, ...args: any[]) => boolean, leftArgs?: any[], stripRightCondition?: (s: string, ...args: any[]) => boolean, rightArgs?: any[] }`
 * - if `stripLeftCondition(s, leftArgs)` is `true` or `stripLeftCondition` is `undefined` (i.e. no conditions need to be met to strip left):
 * - - then the left side of the `s` is stripped of `char`
 * - if `stripRightCondition(s, rightArgs)` is `true` or `stripRightCondition` is `undefined` (i.e. no conditions need to be met to strip right):
 * - - then the right side of the `s` is stripped of `char`
 * @param stripOptions.escape escape special regex characters in `char` with `char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`
 * @returns `string` - the string with leading and trailing characters removed
 */
export function DEP_applyStripOptions(
    s: string, 
    stripOptions: DEP_StringStripOptions
): string {
    if (!s) return '';
    let { char, escape = false, stripLeftCondition = false, leftArgs, stripRightCondition = false, rightArgs } = stripOptions;
    if (escape) {
        char = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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

/**
 * @param s `string` - the string to convert to title case
 * @returns **`s`** `string` - the string in title case 
 * (i.e. first letter of each word, determined by the `\b` boundary metacharacter, is capitalized)
 */
export function toTitleCase(s: string): string {
    if (!s) return '';
    return s
        .replace(/\b\w/g, char => char.toUpperCase())
        .replace(/(?<=\b[A-Z]{1})\w*\b/g, char => char.toLowerCase());
}

/**
 * @deprecated use {@link applyCaseOptions} with {@link StringCaseEnum} instead
 * @param s `string` - the string to handle case options for
 * @param caseOptions — {@link DEP_StringCaseOptions} - `optional` case options to apply to the string
 * = `{ toUpper: boolean, toLower: boolean, toTitle: boolean }`
 * - applies the first case option that is `true` and ignores the rest
 * @returns **`s`** - the string with case options applied
 */
export function DEP_applyCaseOptions(
    s: string, 
    caseOptions: DEP_StringCaseOptions = { toUpper: false, toLower: false, toTitle: false }
): string {
    if (!s) return '';
    const { toUpper, toLower, toTitle } = caseOptions;
    if (toUpper) {
        s = s.toUpperCase();
    } else if (toLower) {
        s = s.toLowerCase();
    } else if (toTitle) {
        s = toTitleCase(s);   
    }
    return s;
}


export function DEP_clean(s: string, options?: DEP_CleanStringOptions): string
/**
 * @description
 * - converts to string and trims, then: 
 * - applies options in this order: `StringReplaceOptions`, `StringStripOptions`, `StringCaseOptions`, `StringPadOptions`
 * - Removes leading+trailing spaces, extra spaces, commas, and dots from a string (e.g. `'..'` becomes `'.'`)
 * - optionally applies 4 option params with: {@link string.replace}, {@link DEP_applyStripOptions}, {@link DEP_applyCaseOptions}, and {@link DEP_applyPadOptions}.
 * @param s `string` to clean
 * @param stripOptions {@link DEP_StringStripOptions}
 * - `optional` strip options to apply to the string
 * - = `{ char: string, escape?: boolean, stripLeftCondition?: (s: string, ...args: any[]) => boolean, leftArgs?: any[], stripRightCondition?: (s: string, ...args: any[]) => boolean, rightArgs?: any[] }`
 * @param caseOptions {@link DEP_StringCaseOptions} 
 * - `optional` case options to apply to the string
 * - = `{ toUpper: boolean, toLower: boolean, toTitle: boolean }`
 * @param padOptions {@link StringPadOptions} 
 * - `optional` padding options to apply to the string
 * - = `{ padLength: number, padChar: string, padLeft: boolean, padRight: boolean }`
 * @param replaceOptions {@link StringReplaceOptions}
 * - `optional` replace options to apply to the string
 * - = `Array<`{@link StringReplaceParams}`>` = `{ searchValue: string | RegExp, replaceValue: string }[]`
 * @returns **`s`** `string`
 */
export function DEP_clean(
    s: string,
    stripOptions?: DEP_StringStripOptions, 
    caseOptions?: DEP_StringCaseOptions,
    padOptions?: DEP_StringPadOptions,
    replaceOptions?: StringReplaceOptions
): string

export function DEP_clean(
    s: string,
    arg2?: DEP_CleanStringOptions | DEP_StringStripOptions, 
    arg3?: DEP_StringCaseOptions,
    arg4?: DEP_StringPadOptions,
    arg5?: StringReplaceOptions
): string {
    if (!s) return '';
    const {
        strip: stripOptions, 
        case: caseOptions,
        pad: padOptions, 
        replace: replaceOptions
    } = (DEP_isCleanStringOptions(arg2)
        ? arg2 as DEP_CleanStringOptions
        : {
            strip: arg2 as DEP_StringStripOptions,
            case: arg3,
            pad: arg4,
            replace: arg5
        } as DEP_CleanStringOptions
    );
    s = String(s).trim() || '';
    s = s.replace(/\s+/g, ' ')
        .replace(/\.{2,}/g, '.')
        .replace(/,{2,}/g, ',');
    if (isNonEmptyArray(replaceOptions)) {
        s = applyReplaceParams(s, replaceOptions)
    }
    if (stripOptions) {
        s = DEP_applyStripOptions(s, stripOptions);
    }
    if (caseOptions) {
        s = DEP_applyCaseOptions(s, caseOptions);
    }   
    if (padOptions && padOptions.padLength) {
        s = DEP_applyPadOptions(s, padOptions);
    }
    return s.trim().replace(/,$/g, '');
}


/**
 * @TODO convert
 * `s = s.replace(/\s+/g, ' ').replace(/\.{2,}/g, '.').replace(/,{2,}/g, ',');` 
 * to StringReplaceOptions and test to ensure consistent output
 * */
const CLEAN_BASIC_REPLACE_OPTIONS: StringReplaceOptions = []