/**
 * @file src/config/dataLoader.ts
 */
import { STOP_RUNNING, DATA_DIR } from "./env";
import { typeshiLogger as mlog, INDENT_LOG_LINE as TAB, NEW_LINE as NL, INFO_LOGS as INFO } from "./setupLog";
import { readJsonFileAsObject as read, validatePath } from "../utils/io/reading";
import { isNonEmptyArray, hasKeys, isNonEmptyString, } from "../utils/typeValidation";
import path from "node:path";
import * as validate from "../utils/argumentValidation";

let dataInitialized = false;

const REGEX_CONSTANTS_DIR = path.join(DATA_DIR, 'regex');
validate.existingDirectoryArgument(`[typeshi.config.dataLoader()]`, {REGEX_CONSTANTS_DIR});

let config: DataLoaderConfig | null = null;
/** 
 * required keys of {@link DataLoaderConfig} 
 * - `['regexFile',]` */
const configKeys = [
    'regexFile',
];

/**
 * @enum {string} **`DataDomainEnum`** `string`
 * @property **`REGEX`** = `'REGEX'`
 */
export enum DataDomainEnum {
    REGEX = 'REGEX'
}

/* ---------------------- LOAD REGEX CONFIG -------------------------- */
let regexConstants: RegexConstants | null = null;

/* ------------------------- MAIN FUNCTION ----------------------------- */
const DEFAULT_DOMAINS_TO_LOAD = [
    DataDomainEnum.REGEX, 
];
/**
 * Initialize all data required by the application.
 * This should be called once at the start of the application.
 */
export async function initializeData(...domains: DataDomainEnum[]): Promise<void> {
    const source = `[typeshi.dataLoader.initializeData()]`;
    if (dataInitialized) {
        mlog.info(`${source} Data already initialized, skipping...`);
        return;
    }
    const DATA_LOADER_CONFIG_FILE = path.join(DATA_DIR, `dataLoader_config.json`);
    validate.existingFileArgument(source, '.json', {DATA_LOADER_CONFIG_FILE});
    config = await loadConfig(DATA_LOADER_CONFIG_FILE) as DataLoaderConfig;
    const regexPath = path.join(REGEX_CONSTANTS_DIR, config.regexFile);
    if (!domains || domains.length === 0) {
        domains.push(...DEFAULT_DOMAINS_TO_LOAD)
    }
    INFO.push((INFO.length === 0 ? '' : NL) 
    + `${source} Starting data initialization...`);
    try {
        for (const d of domains) {
            switch (d) {
                case DataDomainEnum.REGEX:
                    regexConstants = await loadRegexConstants(regexPath);
                    break;
                default:
                    mlog.warn(
                        `${source} Unrecognized data domain: '${d}'. Skipping...`
                    );
                    continue;
            }
        }
        dataInitialized = true;
        INFO.push(NL+`${source} ✓ All data initialized successfully`);
        mlog.info(...INFO);
        INFO.length = 0;
    } catch (error) {
        mlog.error(`${source} ✗ Failed to initialize data:`, error);
        STOP_RUNNING(1, `Data initialization failed`);
    }
}



export function getRegexConstants(): RegexConstants {
    if (!dataInitialized || !regexConstants) {
        throw new Error('[dataLoader.getRegexConstants()] Regex constants not initialized. Call initializeData() first.');
    }
    return regexConstants;
}
/**
 * `Sync` Get company keyword list
 * @returns **`COMPANY_KEYWORD_LIST`** `string[]`
 */
export function getCompanyKeywordList(): string[] {
    const constants = getRegexConstants();
    return constants.COMPANY_KEYWORD_LIST;
}

/**
 * Get job title suffix list
 * @returns **`JOB_TITLE_SUFFIX_LIST`** `string[]`
 */
export function getJobTitleSuffixList(): string[] {
    const constants = getRegexConstants();
    return constants.JOB_TITLE_SUFFIX_LIST;
}


export function isDataInitialized(): boolean {
    return dataInitialized;
}



async function loadConfig(
    jsonPath: string
): Promise<DataLoaderConfig> {
    validatePath(jsonPath);
    let configData = read(jsonPath);
    if (!isDataLoaderConfig(configData)) {
        throw new Error([`[dataLoader.getConfig()] Invalid DataLoaderConfig json file`,
            `config filePath: '${jsonPath}'`,
            `  required keys: ${JSON.stringify(configKeys)}`
        ].join(TAB));
    }
    return configData;
}


/**
 * Load regex constants
 */
async function loadRegexConstants(
    filePath: string
): Promise<RegexConstants> {
    const source = `[dataLoader.loadRegexConstants()]`;
    INFO.push(NL+`${source} Loading regex constants...`);
    validate.existingFileArgument(source, '.json', {filePath});
    const REGEX_CONSTANTS = read(filePath) as Record<string, any>;
    if (!REGEX_CONSTANTS || !hasKeys(REGEX_CONSTANTS, 
        ['COMPANY_KEYWORD_LIST', 'JOB_TITLE_SUFFIX_LIST'])) {
        throw new Error(`${source} Invalid REGEX_CONSTANTS file at '${filePath}'. Expected json object to have 'COMPANY_KEYWORD_LIST' and 'JOB_TITLE_SUFFIX_LIST' keys.`);
    }
    const COMPANY_KEYWORD_LIST: string[] = REGEX_CONSTANTS.COMPANY_KEYWORD_LIST || [];
    if (!isNonEmptyArray(COMPANY_KEYWORD_LIST)) {
        throw new Error(`${source} Invalid COMPANY_KEYWORD_LIST in REGEX_CONSTANTS file at '${filePath}'`);
    }
    const JOB_TITLE_SUFFIX_LIST: string[] = REGEX_CONSTANTS.JOB_TITLE_SUFFIX_LIST || [];
    if (!isNonEmptyArray(JOB_TITLE_SUFFIX_LIST)) {
        throw new Error(`${source} Invalid JOB_TITLE_SUFFIX_LIST in REGEX_CONSTANTS file at '${filePath}'`);
    }
    INFO.push(NL+`${source} ✓ Regex constants loaded successfully`);
    return {
        COMPANY_KEYWORD_LIST,
        JOB_TITLE_SUFFIX_LIST,
    } as RegexConstants;
}


function isDataLoaderConfig(value: any): value is DataLoaderConfig {
    return (value && typeof value === 'object'
        && hasKeys(value, configKeys)
        && Object.values(value).every(v => isNonEmptyString(v))
    );
}


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
    [key: string]: string
}