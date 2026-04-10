"use strict";
/**
 * @file src/utils/regex/misc.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KOREA_ADDRESS_LATIN_TEXT_PATTERN = exports.DATE_STRING_PATTERN = exports.FILE_NAME_WITH_EXTENSION_PATTERN = void 0;
exports.extractFileName = extractFileName;
exports.extractLeaf = extractLeaf;
exports.replaceGroupWithLiteral = replaceGroupWithLiteral;
const typeValidation_1 = require("../typeValidation");
const node_path_1 = __importDefault(require("node:path"));
/**
 * `extractFileNameFromPath`
 * essentially a wrapper for path.basename() for short-hand convenience
 * @param filepath `string` e.g. pass in the node module variable  `__filename`
 * @param removeExtension `boolean` `optional, default = true` - flag indicating
 * whether or not to remove the file extension from the filename
 * @returns **`filename`** `string`
 */
function extractFileName(filepath, removeExtension = true) {
    if (!(0, typeValidation_1.isNonEmptyString)(filepath)) {
        return 'undefined';
    }
    let filename = node_path_1.default.basename(filepath);
    if (removeExtension) {
        filename = filename.replace(/(?<=.+)\.[a-z0-9]{1,}$/i, '');
    }
    return filename;
}
/**
 * = `= /^[^/\\:*?"<>|]+(\.[^/\\:*?"<>|]+)$/`
 */
exports.FILE_NAME_WITH_EXTENSION_PATTERN = /^[^/\\:*?"<>|]+(\.[^/\\:*?"<>|]+)$/;
/**
 * `re` = `/^\s*(\d{4}-\d{2}-\d{2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{4})\s*$/`
 * 1. matches `YYYY-MM-DD` (ISO) format.
 * 2. matches `MM/DD/YYYY` format. assumes `MM/DD/YYYY` format if the first part is less than or equal to 12 I think.
 */
exports.DATE_STRING_PATTERN = new RegExp(/^\s*(\d{4}-\d{2}-\d{2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{4})\s*$/);
/**
 * - e.g. `"Pangyo-ro, Bundag-Gu, Seongnam-si"`
 * `re` = `/^\s*([a-zA-Z]{2,}-[a-zA-Z]{2,},\s*){1,}[a-zA-Z]{2,}-[a-zA-Z]{2,}\s*$/`
 * */
exports.KOREA_ADDRESS_LATIN_TEXT_PATTERN = new RegExp(/^\s*([a-zA-Z]{2,}-[a-zA-Z]{2,},\s*){1,}[a-zA-Z]{2,}-[a-zA-Z]{2,}\s*$/);
/**
 * @param value `string` - the string value from which to extract `leaf`
 * - e.g. `'CLASSA:SKU-1'` -> `sku` with classes removed = `'SKU-1'`
 * @param classDelimiter `string` - the character used to delimit the item's classes
 * - e.g. `classDelimiter` of `'CLASSA:SKU-1'` = `':'`
 * @returns **`leaf`**: `string` - the extracted `leaf` or the original value if no extraction performed
 */
function extractLeaf(value, classDelimiter) {
    let result = value;
    if (result.includes(classDelimiter)) {
        let classifierSplit = result.split(classDelimiter);
        result = classifierSplit[classifierSplit.length - 1];
    }
    return result || value;
}
// @consideration rename keepParentheses to keepGroup or keepGrouping or keepGroupParentheses ?
/**
 * @param keepParentheses `boolean (optional)` `default = false`
 * @returns **new RegExp** with same flags as `re`
 * - returns `re` if does not have `groupName`
 * @example
 * const re = /(?<name>)\s*abcdefg/;
 * let groupName = 'name';
 * let value = 'Bob';
 * let result1 = replaceGroupWithLiteral(re, groupName, value, false);
 * // result1.source === 'Bob\\s*abcdefg'
 * let result2 = replaceGroupWithLiteral(re, groupName, value, true);
 * // result2.source === '(Bob)\\s*abcdefg'
 */
function replaceGroupWithLiteral(re, groupName, value, keepParentheses = false) {
    let pat = (keepParentheses
        ? `(?<=\\\()` + `\\\?<${groupName}>` + `(?=\\\))`
        : `\\\(` + `\\\?<${groupName}>` + `\\\)`);
    let groupPattern = new RegExp(pat);
    if (!groupPattern.test(re.source)) { // re does not contain group
        console.warn(`[regex.misc.replaceGroupWithLiteral()] re does not contain group '${groupName}'`);
        return re;
    }
    let newSource = re.source.replace(groupPattern, value);
    return new RegExp(newSource, re.flags);
}
