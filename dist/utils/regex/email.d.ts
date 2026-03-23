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
export declare function parseEmailAddress(s: string): ParsedEmailAddress | null;
/** @deprecated
 * `re` = `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` */
export declare const EMAIL_REGEX: RegExp;
/**
 * @deprecated
 * return true if matches {@link EMAIL_REGEX} and does not include pattern/string specified in `excludeSubstrings`  */
export declare function isValidEmail(email: string, excludeSubstrings?: string | string[] | RegExp): boolean;
/**
 * @deprecated
 * @returns `RegExpMatchArray` {@link EMAIL_REGEX} */
export declare function extractEmail(email: string): RegExpMatchArray | null;
