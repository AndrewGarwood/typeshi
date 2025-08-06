/**
 * @param phone - `string` - phone number to test
 * @returns **`phone`** - formatted phone number or empty string if unable to format it
 * @description test phone on regex in this order:
 * 1. {@link KOREA_PHONE_REGEX} = `/(?:^|\D)(82)[-).\s]?(\d{1,2})?[-.\s]?(\d{3,4})[-.\s]?(\d{4})(?:\D|$)/`
 * 2. {@link HONG_KONG_PHONE_REGEX} = `/(?:^|\D)(852)[-.\s]?(\d{4})[-.\s]?(\d{4})(?:\D|$)/`
 * 3. {@link CHINA_PHONE_REGEX} = `/(?:^|\D)(86)[-.\s]?(\d{2,3})[-.\s]?(\d{4})[-.\s]?(\d{4})(?:\D|$)`
 * 4. {@link JAPAN_PHONE_REGEX} = `/(?:^|\D)(81)[-.\s]?(\d{1})[-.\s]?(\d{4})[-.\s]?(\d{4})(?:\D|$)/`
 * 5. GENERIC_{@link PHONE_REGEX} = `/(?:^|\D)(\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})[-.\s]?(?:ext|x|ex)?(?:[-:.\s]*)?(\d{1,4})?(?:\D|$)/i`
 * 6. `else` return emtpy string
 * @note Valid formats for NetSuite Phone Number fields are:
 * 1. `999-999-9999`
 * 2. `1-999-999-9999`
 * 3. `(999) 999-9999`
 * 4. `1(999) 999-9999`
 * 5. `999-999-9999 ext 9999`
 */
export declare function extractPhone(phone: string, phoneRegexList?: {
    re: RegExp;
    groupFormat: string;
}[]): string[] | RegExpMatchArray | null;
/**
 * @param phone `string` - the phone number to format
 * @param re {@link RegExp} - the regex to use to extract the phone number
 * @param groupFormat `string` - use to format the phone number
 * - `optional` - if not provided, the phone number is returned as is
 * @returns **`phone`** = `string` - the formatted phone number
 */
export declare function formatPhone(phone: string, re: RegExp, groupFormat?: string): string;
/**
 * @description
 * `re` = `/(?:^|\D)(\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})[-.\s]?(?:ext|x|ex)?(?:[-:.\s]*)?(\d{1,4})?(?:\D|$)/i`
 * - There are 5 capturing groups in the regex:
 * - **`$1`** - Country code (optional) - `(\d{1,3})`
 * - **`$2`** - Area code - `(\d{3})`
 * - **`$3`** - First three digits - `(\d{3})`
 * - **`$4`** - Last four digits - `(\d{4})`
 * - **`$5`** - Extension (optional) - `( ?ext ?(\d{3,4}))?`
 * */
export declare const PHONE_REGEX: RegExp;
/**
 * @description
 * `re` = `/(?:^|\D)(852)[-.\s]?(\d{4})[-.\s]?(\d{4})(?:\D|$)/`
 * - There are 3 capturing groups in the regex:
 * - **`$1`** - Country code - `(852)`
 * - **`$2`** - First four digits - `(\d{4})`
 * - **`$3`** - Last four digits - `(\d{4})`
 */
export declare const HONG_KONG_PHONE_REGEX: RegExp;
/**
 * @description
 * `re` = `/(?:^|\D)(86)[-.\s]?(\d{2,3})[-.\s]?(\d{4})[-.\s]?(\d{4})(?:\D|$)/`
 * - There are 4 capturing groups in the regex:
 * - **`$1`** - Country code - `(86)`
 * - **`$2`** - Area code - `(\d{2,3})`
 * - **`$3`** - First four digits - `(\d{4})`
 * - **`$4`** - Last four digits - `(\d{4})`
 */
export declare const CHINA_PHONE_REGEX: RegExp;
/**
 * @description
 * `re` = `/(?:^|\D)(81)[-.\s]?(\d{1})[-.\s]?(\d{4})[-.\s]?(\d{4})(?:\D|$)/`
 * - There are 4 capturing groups in the regex:
 * - **`$1`** - Country code - `(81)`
 * - **`$2`** - Area code - `(\d{1})`
 * - **`$3`** - First four digits - `(\d{4})`
 * - **`$4`** - Last four digits - `(\d{4})`
 */
export declare const JAPAN_PHONE_REGEX: RegExp;
/**
 * @description
 * `re` = `/(?:^|\D)(82)[-).\s]?(\d{1,2})?[-.\s]?(\d{3,4})[-.\s]?(\d{4})(?:\D|$)/`
 * - There are 4 capturing groups in the regex:
 * - **`$1`** - Country code - `(82)`
 * - **`$2`** - Area code - `(\d{2})`
 * - **`$3`** - First three digits - `(\d{3})`
 * - **`$4`** - Last four digits - `(\d{4})`
 */
export declare const KOREA_PHONE_REGEX: RegExp;
export declare const PHONE_REGEX_LIST: {
    re: RegExp;
    groupFormat: string;
}[];
