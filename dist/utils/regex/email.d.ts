/** `re` = `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` */
export declare const EMAIL_REGEX: RegExp;
/**return true if matches {@link EMAIL_REGEX} and does not include pattern/string specified in `excludeSubstrings`  */
export declare function isValidEmail(email: string, excludeSubstrings?: string | RegExp | string[]): boolean;
/** @returns **`email`**: `string` - the first email that matches {@link EMAIL_REGEX} or an empty string `''`*/
export declare function extractEmail(email: string): RegExpMatchArray | null;
