"use strict";
/**
 * @file src/utils/regex/types/StringOptions.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegExpFlagsEnum = void 0;
/**
 * @reference {@link https://javascript.info/regexp-introduction}
 * @enum {string} **`RegExpFlagsEnum`**
 * @property {string} IGNORE_CASE - `i` - case insensitive "the search is case-insensitive: no difference between `A` and `a`"
 * @property {string} MULTI_LINE - `m` - multi-line "Multiline mode" see {@link https://javascript.info/regexp-multiline-mode}
 * @property {string} GLOBAL - `g` - global search "With this flag the search looks for all matches, without it – only the first match is returned."
 * @property {string} DOT_MATCHES_NEWLINE - `s` - dot matches newline "By default, a dot doesn’t match the newline character `n`."
 * @property {string} UNICODE - `u` - unicode "Enables full Unicode support. The flag enables correct processing of surrogate pairs." see {@link https://javascript.info/regexp-unicode}
 * @property {string} STICKY - `y` - sticky search "searching at the exact position in the text." see {@link https://javascript.info/regexp-sticky}
 */
var RegExpFlagsEnum;
(function (RegExpFlagsEnum) {
    RegExpFlagsEnum["IGNORE_CASE"] = "i";
    RegExpFlagsEnum["MULTI_LINE"] = "m";
    RegExpFlagsEnum["GLOBAL"] = "g";
    RegExpFlagsEnum["DOT_MATCHES_NEWLINE"] = "s";
    RegExpFlagsEnum["UNICODE"] = "u";
    RegExpFlagsEnum["STICKY"] = "y";
})(RegExpFlagsEnum || (exports.RegExpFlagsEnum = RegExpFlagsEnum = {}));
