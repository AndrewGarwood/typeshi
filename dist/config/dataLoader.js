"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataDomainEnum = void 0;
exports.initializeData = initializeData;
exports.getRegexConstants = getRegexConstants;
exports.getCompanyKeywordList = getCompanyKeywordList;
exports.getJobTitleSuffixList = getJobTitleSuffixList;
exports.isDataInitialized = isDataInitialized;
/**
 * @file src/config/dataLoader.ts
 * @TODO change this file and env.ts to use initializeEnvironment() pattern
 */
const env_1 = require("./env");
const setupLog_1 = require("./setupLog");
const reading_1 = require("../utils/io/reading");
const typeValidation_1 = require("../utils/typeValidation");
const node_path_1 = __importDefault(require("node:path"));
const validate = __importStar(require("../utils/argumentValidation"));
let dataInitialized = false;
let config = null;
/**
 * @enum {string} **`DataDomainEnum`** `string`
 * @property **`REGEX`** = `'regex'`
 */
var DataDomainEnum;
(function (DataDomainEnum) {
    DataDomainEnum["REGEX"] = "regex";
})(DataDomainEnum || (exports.DataDomainEnum = DataDomainEnum = {}));
/* ---------------------- LOAD REGEX CONFIG -------------------------- */
let regexConstants = null;
/* ------------------------- MAIN FUNCTION ----------------------------- */
const DEFAULT_DOMAINS_TO_LOAD = [
    DataDomainEnum.REGEX,
];
/**
 * Initialize all data required by the application.
 * This should be called once at the start of the application.
 */
async function initializeData(...domains) {
    const source = getSourceString(__filename, initializeData.name);
    if (dataInitialized) {
        setupLog_1.typeshiLogger.info(`${source} Data already initialized, skipping...`);
        return;
    }
    if (!domains || domains.length === 0) {
        domains.push(...DEFAULT_DOMAINS_TO_LOAD);
    }
    setupLog_1.typeshiSimpleLogger.info(`${source} Starting data initialization...`);
    try {
        const configPath = node_path_1.default.join(env_1.DATA_DIR, `typeshi.data.config.json`);
        config = await loadConfig(configPath);
        for (const d of domains) {
            switch (d) {
                case DataDomainEnum.REGEX:
                    regexConstants = await loadRegexConstants(node_path_1.default.join(env_1.DATA_DIR, DataDomainEnum.REGEX, config.regexFile));
                    break;
                default:
                    setupLog_1.typeshiLogger.warn(`${source} Unrecognized data domain: '${d}'. Skipping...`);
                    continue;
            }
        }
        dataInitialized = true;
        setupLog_1.typeshiSimpleLogger.info(`${source} ✓ All data initialized successfully`);
    }
    catch (error) {
        setupLog_1.typeshiLogger.error(`${source} ✗ Failed to initialize data:`, error);
        (0, env_1.STOP_RUNNING)(1, `Data initialization failed`);
    }
}
function getRegexConstants() {
    if (!dataInitialized || !regexConstants) {
        throw new Error('[dataLoader.getRegexConstants()] Regex constants not initialized. Call initializeData() first.');
    }
    return regexConstants;
}
/**
 * `Sync` Get company keyword list
 * @returns **`COMPANY_KEYWORD_LIST`** `string[]`
 */
function getCompanyKeywordList() {
    const constants = getRegexConstants();
    return constants.COMPANY_KEYWORD_LIST;
}
/**
 * Get job title suffix list
 * @returns **`JOB_TITLE_SUFFIX_LIST`** `string[]`
 */
function getJobTitleSuffixList() {
    const constants = getRegexConstants();
    return constants.JOB_TITLE_SUFFIX_LIST;
}
function isDataInitialized() {
    return dataInitialized;
}
async function loadConfig(jsonPath) {
    const source = getSourceString(__filename, loadConfig.name);
    validate.existingFileArgument(source, '.json', { jsonPath });
    let configData = (0, reading_1.readJsonFileAsObject)(jsonPath);
    validate.objectArgument(source, { configData, isDataLoaderConfig });
    return configData;
}
/**
 * Load regex constants
 */
async function loadRegexConstants(filePath) {
    const source = getSourceString(__filename, loadRegexConstants.name);
    setupLog_1.typeshiSimpleLogger.info(`${source} Loading regex constants...`);
    validate.existingFileArgument(source, '.json', { filePath });
    const REGEX_CONSTANTS = (0, reading_1.readJsonFileAsObject)(filePath);
    if (!REGEX_CONSTANTS || !(0, typeValidation_1.hasKeys)(REGEX_CONSTANTS, ['COMPANY_KEYWORD_LIST', 'JOB_TITLE_SUFFIX_LIST'])) {
        throw new Error(`${source} Invalid REGEX_CONSTANTS file at '${filePath}'. Expected json object to have 'COMPANY_KEYWORD_LIST' and 'JOB_TITLE_SUFFIX_LIST' keys.`);
    }
    const COMPANY_KEYWORD_LIST = REGEX_CONSTANTS.COMPANY_KEYWORD_LIST || [];
    if (!(0, typeValidation_1.isNonEmptyArray)(COMPANY_KEYWORD_LIST)) {
        throw new Error(`${source} Invalid COMPANY_KEYWORD_LIST in REGEX_CONSTANTS file at '${filePath}'`);
    }
    const JOB_TITLE_SUFFIX_LIST = REGEX_CONSTANTS.JOB_TITLE_SUFFIX_LIST || [];
    if (!(0, typeValidation_1.isNonEmptyArray)(JOB_TITLE_SUFFIX_LIST)) {
        throw new Error(`${source} Invalid JOB_TITLE_SUFFIX_LIST in REGEX_CONSTANTS file at '${filePath}'`);
    }
    setupLog_1.typeshiSimpleLogger.info(`${source} ✓ Regex constants loaded successfully`);
    return {
        COMPANY_KEYWORD_LIST,
        JOB_TITLE_SUFFIX_LIST,
    };
}
function isDataLoaderConfig(value) {
    return ((0, typeValidation_1.isObject)(value)
        && Object.values(value).every(v => (0, typeValidation_1.isNonEmptyString)(v)));
}
function getSourceString(fileName, func, funcInfo) {
    fileName = node_path_1.default.basename(fileName).replace(/(?<=.+)\.[a-z0-9]{1,}$/i, '');
    let funcName = typeof func === 'string' ? func : func.name;
    return `[typeshi.${fileName}.${funcName}(${(0, typeValidation_1.isNonEmptyString)(funcInfo) ? ` ${funcInfo} ` : ''})]`;
}
