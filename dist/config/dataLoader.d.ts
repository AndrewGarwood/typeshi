/**
 * @enum {string} **`DataDomainEnum`** `string`
 * @property **`REGEX`** = `'regex'`
 */
export declare enum DataDomainEnum {
    REGEX = "regex"
}
/**
 * Initialize all data required by the application.
 * This should be called once at the start of the application.
 */
export declare function initializeData(...domains: DataDomainEnum[]): Promise<void>;
export declare function getRegexConstants(): RegexConstants;
/**
 * `Sync` Get company keyword list
 * @returns **`COMPANY_KEYWORD_LIST`** `string[]`
 */
export declare function getCompanyKeywordList(): string[];
/**
 * Get job title suffix list
 * @returns **`JOB_TITLE_SUFFIX_LIST`** `string[]`
 */
export declare function getJobTitleSuffixList(): string[];
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
