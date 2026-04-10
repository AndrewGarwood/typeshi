"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_REGEX = void 0;
exports.parseEmailAddress = parseEmailAddress;
exports.isValidEmail = isValidEmail;
exports.extractEmail = extractEmail;
/**
 * @file src/utils/regex/email.ts
 */
const Str_1 = require("./Str");
// @TODO parameterize replacements in parsed displayName
/**
 * @param s `string`
 * - e.g. `"{local}@{domain}"`, `"{displayName} <{local}@{domain}>"`
 * @returns **`result`** {@link ParsedEmailAddress}` | null`
 * @note `ParsedEmail.displayName` will be `undefined` if not present in `s`
 * - prefix `/^no(-)?reply\s*(?=\w)/i` is removed from `displayName`
 */
function parseEmailAddress(s) {
    const emailRegex = /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const matchArrays = Array.from(s.matchAll(emailRegex));
    if (matchArrays.length === 0)
        return null;
    const match = matchArrays[0];
    const [address, local, domain] = match;
    const displayName = (s
        .slice(0, match.index ?? 0)
        .trim()
        .replace(/^no(-)?reply\s*(?=\w)/i, '')
        .replace(/<$/, '')
        .trim());
    const result = { address, local, domain };
    if (displayName)
        result.displayName = displayName;
    return result;
}
/** @deprecated
 * `re` = `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` */
exports.EMAIL_REGEX = new RegExp(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
/**
 * @deprecated
 * return true if matches {@link EMAIL_REGEX} and does not include pattern/string specified in `excludeSubstrings`  */
function isValidEmail(email, excludeSubstrings) {
    if (!email)
        return false;
    email = email.trim();
    return (excludeSubstrings
        ? exports.EMAIL_REGEX.test(email) && !Str_1.Str.contains(email, excludeSubstrings)
        : exports.EMAIL_REGEX.test(email));
}
/**
 * @deprecated
 * @returns `RegExpMatchArray` {@link EMAIL_REGEX} */
function extractEmail(email) {
    if (!email)
        return null;
    return email.trim().match(exports.EMAIL_REGEX);
}
