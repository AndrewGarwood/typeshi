"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCleanStringOptions = isCleanStringOptions;
const typeValidation_1 = require("../../typeValidation");
/**
 * - {@link CleanStringOptions}
 * @param value `any`
 * @returns **`isCleanStringOptions`** `boolean`
 * - **`true`** if the `value` is an object with at least one key in `['strip', 'case', 'pad', 'replace']` and no other keys,
 * - **`false`** `otherwise`.
 */
function isCleanStringOptions(value) {
    return (value && typeof value === 'object'
        && (0, typeValidation_1.hasKeys)(value, ['strip', 'case', 'pad', 'replace'], false, true));
}
