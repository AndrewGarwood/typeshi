/**
 * @file src/utils/regex/misc.ts
 */
/**
 * `extractFileNameFromPath`
 * essentially a wrapper for path.basename() for short-hand convenience
 * @param filePath `string` e.g. pass in the node module variable  `__filename`
 * @param removeExtension `boolean` `optional, default = true` - flag indicating
 * whether or not to remove the file extension from the fileName
 * @returns **`fileName`** `string`
 */
export declare function extractFileName(filePath: string, removeExtension?: boolean): string;
/**
 * = `= /^[^/\\:*?"<>|]+(\.[^/\\:*?"<>|]+)$/`
 */
export declare const FILE_NAME_WITH_EXTENSION_PATTERN: RegExp;
/**
 * `re` = `/^\s*(\d{4}-\d{2}-\d{2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{4})\s*$/`
 * 1. matches `YYYY-MM-DD` (ISO) format.
 * 2. matches `MM/DD/YYYY` format. assumes `MM/DD/YYYY` format if the first part is less than or equal to 12 I think.
 */
export declare const DATE_STRING_PATTERN: RegExp;
/**
 * - e.g. `"Pangyo-ro, Bundag-Gu, Seongnam-si"`
 * `re` = `/^\s*([a-zA-Z]{2,}-[a-zA-Z]{2,},\s*){1,}[a-zA-Z]{2,}-[a-zA-Z]{2,}\s*$/`
 * */
export declare const KOREA_ADDRESS_LATIN_TEXT_PATTERN: RegExp;
/**
 * @param value `string` - the string value from which to extract `leaf`
 * - e.g. `'CLASSA:SKU-1'` -> `sku` with classes removed = `'SKU-1'`
 * @param classDelimiter `string` - the character used to delimit the item's classes
 * - e.g. `classDelimiter` of `'CLASSA:SKU-1'` = `':'`
 * @returns **`leaf`**: `string` - the extracted `leaf` or the original value if no extraction performed
 */
export declare function extractLeaf(value: string, classDelimiter: string): string;
