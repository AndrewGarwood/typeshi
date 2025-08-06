"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_REGEX = void 0;
exports.isValidEmail = isValidEmail;
exports.extractEmail = extractEmail;
/**
 * @file src/utils/regex/email.ts
 */
const stringOperations_1 = require("./stringOperations");
const configureParameters_1 = require("./configureParameters");
/** `re` = `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` */
exports.EMAIL_REGEX = new RegExp(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, configureParameters_1.RegExpFlagsEnum.GLOBAL);
/**return true if matches {@link EMAIL_REGEX} and does not include substring `'@benev'`  */
function isValidEmail(email) {
    if (!email)
        return false;
    email = email.trim();
    return exports.EMAIL_REGEX.test(email)
        && !(0, stringOperations_1.stringContainsAnyOf)(email, /@benev/, configureParameters_1.RegExpFlagsEnum.IGNORE_CASE, configureParameters_1.RegExpFlagsEnum.GLOBAL);
}
/** @returns **`email`**: `string` - the first email that matches {@link EMAIL_REGEX} or an empty string `''`*/
function extractEmail(email) {
    if (!email)
        return null;
    email = email.trim();
    const match = email.match(exports.EMAIL_REGEX);
    // DEBUG.push(
    //     NL + `extractEmail() EMAIL_REGEX.test("${email}") = ${EMAIL_REGEX.test(email)}`, 
    //     TAB + `match=${JSON.stringify(match)}`
    // );
    if (match) {
        // DEBUG.push(NL+`-> match not null -> returning ${JSON.stringify(match)}`);
        return match;
    }
    // DEBUG.push(NL+`-> match is null -> returning null`);
    return null;
}
