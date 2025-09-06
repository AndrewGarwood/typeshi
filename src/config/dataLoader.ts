/**
 * @file src/config/dataLoader.ts
 * @TODO change this file and env.ts to use initializeEnvironment() pattern
 */
import { STOP_RUNNING, DATA_DIR } from "./env";
import { 
    typeshiLogger as mlog, INDENT_LOG_LINE as TAB, NEW_LINE as NL, 
    typeshiSimpleLogger as slog 
} from "./setupLog";
import { readJsonFileAsObject as read } from "../utils/io/reading";
import { isNonEmptyArray, hasKeys, isNonEmptyString, isObject } from "../utils/typeValidation";
import path from "node:path";
import * as validate from "../utils/argumentValidation";

let dataInitialized = false;

let config: DataLoaderConfig | null = null;

/**
 * @enum {string} **`DataDomainEnum`** `string`
 * @property **`REGEX`** = `'regex'`
 */
export enum DataDomainEnum {
    REGEX = 'regex'
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
    const source = getSourceString(__filename, initializeData.name);
    if (dataInitialized) {
        mlog.info(`${source} Data already initialized, skipping...`);
        return;
    }
    
    if (!domains || domains.length === 0) {
        domains.push(...DEFAULT_DOMAINS_TO_LOAD)
    }
    slog.info(`${source} Starting data initialization...`);
    try {
        const configPath = path.join(DATA_DIR, `typeshi.data.config.json`);        
        config = await loadConfig(configPath) as DataLoaderConfig;
        for (const d of domains) {
            switch (d) {
                case DataDomainEnum.REGEX:
                    regexConstants = await loadRegexConstants(path.join(DATA_DIR, DataDomainEnum.REGEX, config.regexFile));
                    break;
                default:
                    mlog.warn(
                        `${source} Unrecognized data domain: '${d}'. Skipping...`
                    );
                    continue;
            }
        }
        dataInitialized = true;
        slog.info(`${source} ✓ All data initialized successfully`);
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
    const source = getSourceString(__filename, loadConfig.name);
    validate.existingFileArgument(source, '.json', {jsonPath});
    let configData = read(jsonPath);
    validate.objectArgument(source, {configData, isDataLoaderConfig});
    return configData as DataLoaderConfig;
}


/**
 * Load regex constants
 */
async function loadRegexConstants(
    filePath: string
): Promise<RegexConstants> {
    const source = getSourceString(__filename, loadRegexConstants.name);
    slog.info(`${source} Loading regex constants...`);
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
    slog.info(`${source} ✓ Regex constants loaded successfully`);
    return {
        COMPANY_KEYWORD_LIST,
        JOB_TITLE_SUFFIX_LIST,
    } as RegexConstants;
}


function isDataLoaderConfig(value: any): value is DataLoaderConfig {
    return (isObject(value)
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

function getSourceString(
    fileName: string, 
    func: string | Function, 
    funcInfo?: any, 
): string {
    fileName = path.basename(fileName).replace(/(?<=.+)\.[a-z0-9]{1,}$/i, '');
    let funcName = typeof func === 'string' ? func : func.name
    return `[typeshi.${fileName}.${funcName}(${isNonEmptyString(funcInfo) ? ` ${funcInfo} `: ''})]`;
}