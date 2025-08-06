/**
 * `re` = `/^\s*(\d{4}-\d{2}-\d{2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{4})\s*$/`
 * 1. matches `YYYY-MM-DD` (ISO) format.
 * 2. matches `MM/DD/YYYY` format. assumes `MM/DD/YYYY` format if the first part is less than or equal to 12 I think.
 */
export declare const DATE_STRING_PATTERN: RegExp;
/** e.g. `"Pangyo-ro, Bundag-Gu, Seongnam-si"` */
export declare const KOREA_ADDRESS_LATIN_TEXT_PATTERN: RegExp;
/**
 * - checks if matches `skuPattern = /(?<=^.*:)(\w|-)*(?= .*$)/`
 * - checks if included in `skuExceptions = ['DISCOUNT (Discount)', 'S&H (Shipping)']`
 * @param skuValue `string` - the initial column value to extract SKU from
 * @returns **`sku`**: `string` - the extracted SKU or empty string if no valid SKU found
 */
export declare function extractSku(skuValue: string): string;
