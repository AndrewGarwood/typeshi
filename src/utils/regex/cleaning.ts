/**
 * @file src/utils/regex/cleaning.ts
 */
import { typeshiLogger as mlog, INDENT_LOG_LINE as TAB, NEW_LINE as NL } from "../../config";
import { isNonEmptyArray, isNonEmptyString, isPositveInteger } from "../typeValidation";
import { 
    StringCaseEnum,
    StringPadOptions, StringReplaceOptions, StringPadEnum, StringCleanOptions, StringReplaceParams, StringStripOptions,
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
            mlog.error([`[applyPadOptions()] Invalid argument 'options.side'`,
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
                '[applyCaseOptions()] Unsupported case option. Returning original string.', 
                `Expected: 'upper' | 'lower' | 'title'`, 
                `Received: '${caseOptions}'`
            ].join(TAB));
            return s;
    }
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
