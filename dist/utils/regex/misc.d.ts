/**
 * @file src/utils/regex/misc.ts
 */
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
/** e.g. `"Pangyo-ro, Bundag-Gu, Seongnam-si"` */
export declare const KOREA_ADDRESS_LATIN_TEXT_PATTERN: RegExp;
/**
 * @consideration `removeClasses` is unnecessary, can assume true if a value for
 * classDelimiter is provided -> have to remove default value for classDelimiter
 * @param value `string` - the string value from which to extract `leaf`
 * @param removeClasses `boolean` - remove string prefixes from result `leaf`
 * - `Default` = `true`
 * - e.g. `'CLASSA:SKU-1'` -> `sku` with classes removed = `'SKU-1'`
 * @param classDelimiter `string` - the character used to delimit the item's classes
 * - `Default` = `':'` (colon character)
 * - e.g. `classDelimiter` of `'CLASSA:SKU-1'` = `':'`
 * @returns **`leaf`**: `string` - the extracted `leaf` or the original value if no extraction performed
 */
export declare function extractLeaf(value: string, removeClasses?: boolean, classDelimiter?: string): string;
