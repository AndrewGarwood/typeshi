/**
 * @file src/utils/regex/email.ts
 */
import { Str } from "./Str";

export interface ParsedEmailAddress {
    /** the whole email address */
    address: string;
    /** `localPart` the part before the @ sign */
    local: string;
    /** the part after the @ sign */
    domain: string;
    /** sender's display name if present in source string */
    displayName?: string;
}
/**
 * @param s `string`
 * - e.g. `"{local}@{domain}"`, `"{displayName} <{local}@{domain}>"`
 * @returns **`result`** {@link ParsedEmailAddress}` | null`
 * @note `ParsedEmail.displayName` will be `undefined` if not present in `s`
 * - prefix `/^no(-)?reply\s*(?=\w)/i` is removed from `displayName`
 */
export function parseEmailAddress(s: string): ParsedEmailAddress | null {
    const emailRegex: RegExp = /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const matchArrays = Array.from(s.matchAll(emailRegex));
    if (matchArrays.length === 0) return null;
    const match = matchArrays[0];
    const [address, local, domain] = match;
    const displayName = (s
        .slice(0, match.index ?? 0)
        .trim()
        .replace(/^no(-)?reply\s*(?=\w)/i, '')
        .replace(/<$/, '')
        .trim()
    );
    const result: ParsedEmailAddress = { address, local, domain };
    if (displayName) result.displayName = displayName;
    return result;
}
/** @deprecated
 * `re` = `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` */
export const EMAIL_REGEX = new RegExp(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, 
);

/**
 * @deprecated
 * return true if matches {@link EMAIL_REGEX} and does not include pattern/string specified in `excludeSubstrings`  */
export function isValidEmail(email: string, excludeSubstrings?: string | string[] | RegExp): boolean {
    if (!email) return false;
    email = email.trim();
    return (excludeSubstrings 
        ? EMAIL_REGEX.test(email) && !Str.contains(email, excludeSubstrings) 
        : EMAIL_REGEX.test(email)
    );
}

/**
 * @deprecated 
 * @returns `RegExpMatchArray` {@link EMAIL_REGEX} */
export function extractEmail(email: string): RegExpMatchArray | null {
    if (!email) return null;
    return email.trim().match(EMAIL_REGEX);
}
