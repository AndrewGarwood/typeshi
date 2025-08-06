"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KOREA_ADDRESS_LATIN_TEXT_PATTERN = exports.DATE_STRING_PATTERN = void 0;
exports.extractSku = extractSku;
/**
 * @file src/utils/regex/misc.ts
 */
const typeValidation_1 = require("../typeValidation");
const config_1 = require("../../config");
/**
 * `re` = `/^\s*(\d{4}-\d{2}-\d{2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{4})\s*$/`
 * 1. matches `YYYY-MM-DD` (ISO) format.
 * 2. matches `MM/DD/YYYY` format. assumes `MM/DD/YYYY` format if the first part is less than or equal to 12 I think.
 */
exports.DATE_STRING_PATTERN = new RegExp(/^\s*(\d{4}-\d{2}-\d{2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{4})\s*$/);
/** e.g. `"Pangyo-ro, Bundag-Gu, Seongnam-si"` */
exports.KOREA_ADDRESS_LATIN_TEXT_PATTERN = new RegExp(/^\s*([a-zA-Z]{2,}-[a-zA-Z]{2,},\s*){1,}[a-zA-Z]{2,}-[a-zA-Z]{2,}\s*$/);
/**
 * - checks if matches `skuPattern = /(?<=^.*:)(\w|-)*(?= .*$)/`
 * - checks if included in `skuExceptions = ['DISCOUNT (Discount)', 'S&H (Shipping)']`
 * @param skuValue `string` - the initial column value to extract SKU from
 * @returns **`sku`**: `string` - the extracted SKU or empty string if no valid SKU found
 */
function extractSku(skuValue) {
    const skuExceptions = ['DISCOUNT (Discount)', 'S&H (Shipping)'];
    const skuPattern = new RegExp(/(?<=^.*:)(\w|-)*(?= .*$)/);
    // e.g. skuValue: string = 'Miracu:3FX18101802GA (Miracu Thread Forte Fix 10 units  (18GX100mm))';
    if (skuPattern.test(skuValue)) {
        const match = skuValue.match(skuPattern);
        if (match && (0, typeValidation_1.isNonEmptyArray)(match)) {
            return match[0].trim();
        }
    }
    else if (skuExceptions.includes(skuValue)) {
        return skuValue.split(' ')[0]; // return the skuValue as is if it is an exception
    }
    config_1.mainLogger.warn('extractSku() - No valid SKU found in the provided value:', skuValue);
    return '';
}
