"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_REGEX = void 0;
exports.isValidEmail = isValidEmail;
exports.extractEmail = extractEmail;
/**
 * @file src/utils/regex/email.ts
 */
const stringOperations_1 = require("./stringOperations");
const StringOptions_1 = require("./types/StringOptions");
/** `re` = `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` */
exports.EMAIL_REGEX = new RegExp(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, StringOptions_1.RegExpFlagsEnum.GLOBAL);
/**return true if matches {@link EMAIL_REGEX} and does not include pattern/string specified in `excludeSubstrings`  */
function isValidEmail(email, excludeSubstrings) {
    if (!email)
        return false;
    email = email.trim();
    return exports.EMAIL_REGEX.test(email)
        && (excludeSubstrings ? !(0, stringOperations_1.stringContainsAnyOf)(email, excludeSubstrings) : true);
}
/** @returns **`email`**: `string` - the first email that matches {@link EMAIL_REGEX} or an empty string `''`*/
function extractEmail(email) {
    if (!email)
        return null;
    email = email.trim();
    const match = email.match(exports.EMAIL_REGEX);
    if (match) {
        return match;
    }
    return null;
}
