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
const typeValidation_1 = require("../typeValidation");
const node_path_1 = __importDefault(require("node:path"));
/**
 * `extractFileNameFromPath`
 * essentially a wrapper for path.basename() for short-hand convenience
 * @param filePath `string` e.g. pass in the node module variable  `__filename`
 * @param removeExtension `boolean` `optional, default = true` - flag indicating
 * whether or not to remove the file extension from the fileName
 * @returns **`fileName`** `string`
 */
function extractFileName(filePath, removeExtension = true) {
    if (!(0, typeValidation_1.isNonEmptyString)(filePath)) {
        return 'undefined';
    }
    let fileName = node_path_1.default.basename(filePath);
    if (removeExtension) {
        fileName = fileName.replace(/(?<=.+)\.[a-z0-9]{1,}$/i, '');
    }
    return fileName;
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
/** e.g. `"Pangyo-ro, Bundag-Gu, Seongnam-si"` */
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
