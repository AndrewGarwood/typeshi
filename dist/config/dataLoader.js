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
exports.isDataInitialized = isDataInitialized;
/**
 * @file src/config/dataLoader.ts
 * @description Centralized data loading to avoid circular dependencies
 * and ensure proper initialization order
 */
const env_1 = require("./env");
const setupLog_1 = require("./setupLog");
const reading_1 = require("../utils/io/reading");
const typeValidation_1 = require("../utils/typeValidation");
const node_path_1 = __importDefault(require("node:path"));
const validate = __importStar(require("../utils/argumentValidation"));
let dataInitialized = false;
const REGEX_CONSTANTS_DIR = node_path_1.default.join(env_1.DATA_DIR, 'regex');
validate.existingDirectoryArgument(`[typeshi.config.dataLoader()]`, { REGEX_CONSTANTS_DIR });
let config = null;
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
var DataDomainEnum;
(function (DataDomainEnum) {
    DataDomainEnum["REGEX"] = "REGEX";
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
    const source = `[typeshi.dataLoader.initializeData()]`;
    if (dataInitialized) {
        setupLog_1.mainLogger.info(`${source} Data already initialized, skipping...`);
        return;
    }
    const DATA_LOADER_CONFIG_FILE = node_path_1.default.join(env_1.DATA_DIR, `dataLoader_config.json`);
    validate.existingFileArgument(source, '.json', { DATA_LOADER_CONFIG_FILE });
    config = await loadConfig(DATA_LOADER_CONFIG_FILE);
    const regexPath = node_path_1.default.join(REGEX_CONSTANTS_DIR, config.regexFile);
    if (!domains || domains.length === 0) {
        domains.push(...DEFAULT_DOMAINS_TO_LOAD);
    }
    setupLog_1.INFO_LOGS.push((setupLog_1.INFO_LOGS.length === 0 ? '' : setupLog_1.NEW_LINE)
        + `${source} Starting data initialization...`);
    try {
        for (const d of domains) {
            switch (d) {
                case DataDomainEnum.REGEX:
                    regexConstants = await loadRegexConstants(regexPath);
                    break;
                default:
                    setupLog_1.mainLogger.warn(`${source} Unrecognized data domain: '${d}'. Skipping...`);
                    continue;
            }
        }
        dataInitialized = true;
        setupLog_1.INFO_LOGS.push(setupLog_1.NEW_LINE + `${source} ✓ All data initialized successfully`);
        setupLog_1.mainLogger.info(...setupLog_1.INFO_LOGS);
        setupLog_1.INFO_LOGS.length = 0;
    }
    catch (error) {
        setupLog_1.mainLogger.error(`${source} ✗ Failed to initialize data:`, error);
        (0, env_1.STOP_RUNNING)(1, `Data initialization failed`);
    }
}
function getRegexConstants() {
    if (!dataInitialized || !regexConstants) {
        throw new Error('[dataLoader.getRegexConstants()] Regex constants not initialized. Call initializeData() first.');
    }
    return regexConstants;
}
function isDataInitialized() {
    return dataInitialized;
}
async function loadConfig(jsonPath) {
    (0, reading_1.validatePath)(jsonPath);
    let configData = (0, reading_1.readJsonFileAsObject)(jsonPath);
    if (!isDataLoaderConfig(configData)) {
        throw new Error([`[dataLoader.getConfig()] Invalid DataLoaderConfig json file`,
            `config filePath: '${jsonPath}'`,
            `  required keys: ${JSON.stringify(configKeys)}`
        ].join(setupLog_1.INDENT_LOG_LINE));
    }
    return configData;
}
/**
 * Load regex constants
 */
async function loadRegexConstants(filePath) {
    const source = `[dataLoader.loadRegexConstants()]`;
    setupLog_1.INFO_LOGS.push(setupLog_1.NEW_LINE + `${source} Loading regex constants...`);
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
    setupLog_1.INFO_LOGS.push(setupLog_1.NEW_LINE + `${source} ✓ Regex constants loaded successfully`);
    return {
        COMPANY_KEYWORD_LIST,
        JOB_TITLE_SUFFIX_LIST,
    };
}
function isDataLoaderConfig(value) {
    return (value && typeof value === 'object'
        && (0, typeValidation_1.hasKeys)(value, configKeys)
        && Object.values(value).every(v => (0, typeValidation_1.isNonEmptyString)(v)));
}
