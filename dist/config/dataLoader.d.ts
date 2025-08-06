/**
 * @enum {string} **`DataDomainEnum`** `string`
 * @property **`REGEX`** = `'REGEX'`
 */
export declare enum DataDomainEnum {
    REGEX = "REGEX"
}
/**
 * Initialize all data required by the application.
 * This should be called once at the start of the application.
 */
export declare function initializeData(...domains: DataDomainEnum[]): Promise<void>;
export declare function getRegexConstants(): RegexConstants;
export declare function isDataInitialized(): boolean;
/**
 * @interface **`RegexConstants`**
 * @property **`COMPANY_KEYWORD_LIST`** `string[]`
 * @property **`JOB_TITLE_SUFFIX_LIST`** `string[]`
 */
export interface RegexConstants {
    COMPANY_KEYWORD_LIST: string[];
    JOB_TITLE_SUFFIX_LIST: string[];
}
export type DataLoaderConfig = {
    regexFile: string;
    [key: string]: string;
};
