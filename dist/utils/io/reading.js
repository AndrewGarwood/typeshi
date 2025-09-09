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
exports.readJsonSync = void 0;
exports.isDirectory = isDirectory;
exports.isFile = isFile;
exports.getDelimiterFromFilePath = getDelimiterFromFilePath;
exports.readJsonFileAsObject = readJsonFileAsObject;
exports.coerceFileExtension = coerceFileExtension;
exports.concatenateFiles = concatenateFiles;
exports.getRows = getRows;
exports.getExcelRows = getExcelRows;
exports.getCsvRows = getCsvRows;
exports.getOneToOneDictionary = getOneToOneDictionary;
exports.getColumnValues = getColumnValues;
exports.getIndexedColumnValues = getIndexedColumnValues;
exports.handleFileArgument = handleFileArgument;
exports.getDirectoryFiles = getDirectoryFiles;
exports.getOneToManyDictionary = getOneToManyDictionary;
exports.parseExcelForOneToMany = parseExcelForOneToMany;
exports.parseCsvForOneToMany = parseCsvForOneToMany;
exports.isValidCsv = isValidCsv;
exports.isValidCsvSync = isValidCsvSync;
exports.analyzeCsv = analyzeCsv;
exports.repairCsv = repairCsv;
exports.validatePath = validatePath;
exports.extractTargetRows = extractTargetRows;
exports.findMissingValues = findMissingValues;
/**
 * @file src/utils/io/reading.ts
 */
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = __importDefault(require("fs"));
const stream_1 = require("stream");
const csv_parser_1 = __importDefault(require("csv-parser"));
const xlsx_1 = __importDefault(require("xlsx"));
const regex_1 = require("../regex");
const misc_1 = require("../regex/misc");
const config_1 = require("../../config");
const types_1 = require("./types");
const typeValidation_1 = require("../typeValidation");
const validate = __importStar(require("../argumentValidation"));
const logging_1 = require("./logging");
const F = (0, misc_1.extractFileName)(__filename);
/** for testing if `pathString (value)` points to an existing directory */
function isDirectory(value) {
    return ((0, typeValidation_1.isNonEmptyString)(value)
        && fs_1.default.existsSync(value)
        && fs_1.default.statSync(value).isDirectory());
}
/** for testing if `pathString (value)` points to an existing file */
function isFile(value) {
    return ((0, typeValidation_1.isNonEmptyString)(value)
        && fs_1.default.existsSync(value)
        && fs_1.default.statSync(value).isFile());
}
/**
 * Determines the proper delimiter based on file type or extension
 * @param filePath `string` Path to the file
 * @returns **`delimiter`** `{`{@link DelimiterCharacterEnum}` | string}` The delimiter character
 * @throws an error if the file extension is unsupported
 */
function getDelimiterFromFilePath(filePath) {
    const extension = filePath.split('.').pop()?.toLowerCase();
    if (extension === types_1.DelimitedFileTypeEnum.CSV) {
        return types_1.DelimiterCharacterEnum.COMMA;
    }
    else if (extension === types_1.DelimitedFileTypeEnum.TSV) {
        return types_1.DelimiterCharacterEnum.TAB;
    }
    else {
        throw new Error(`[reading.getDelimiterFromFilePath()] Unsupported file extension: ${extension}`);
    }
}
/**
 * @param filePath `string`
 * @returns **`jsonData`** — `Record<string, any>`
 * - JSON data as an object
 */
exports.readJsonSync = readJsonFileAsObject;
/**
 * @param filePath `string`
 * @returns **`jsonData`** — `Record<string, any>`
 * - JSON data as an object
 */
function readJsonFileAsObject(filePath) {
    const source = (0, logging_1.getSourceString)(F, readJsonFileAsObject.name);
    try {
        filePath = coerceFileExtension(filePath, 'json');
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    }
    catch (error) {
        config_1.typeshiLogger.error([`${source} Error reading JSON file`,
            `Given filePath: '${filePath}'`,
            `error: `, JSON.stringify(error, null, 4)
        ].join(config_1.INDENT_LOG_LINE));
        throw new Error(JSON.stringify(error));
    }
}
/**
 * @param filePath `string`
 * @param expectedExtension `string`
 * @returns **`validatedFilePath`** `string`
 */
function coerceFileExtension(filePath, expectedExtension) {
    validate.multipleStringArguments(`reading.coerceFileExtension`, { filePath, expectedExtension });
    expectedExtension = expectedExtension.replace(/\./, '');
    if (filePath.endsWith(`.${expectedExtension}`)) {
        return filePath;
    }
    return filePath + '.' + expectedExtension;
}
/**
 * - {@link getDirectoryFiles}
 * @param arg1 `Array<`{@link FileData}` | string> | string`
 * - `files:` {@link FileData}`[]`
 * - `filePaths:` `string[]`
 * - `dirPath:` `string`
 * @param sheetName `string`
 * @param requiredHeaders `string[]` `if` left `undefined`,
 * `requiredHeaders` will be set to the headers of first non empty file from `arg1`
 * @param strictRequirement `boolean`
 * - `Default` = `true`
 * - `if` `true`, then every `row` **must** have headers/keys exactly equal to `requiredHeaders`
 * - `else` `false`, then if a `row` is missing one or more `header` in `requiredHeaders`,
 * for each missing `header`, set `row[header] = ''` (empty string),
 * @param targetExtensions `string[]` try to read rows of all files whose type is in `targetExtensions`
 * @returns **`concatenatedRows`** `Promise<Record<string, any>[]>`
 */
async function concatenateFiles(arg1, sheetName = 'Sheet1', requiredHeaders = [], strictRequirement = true, targetExtensions = ['.csv', '.tsv', '.xlsx']) {
    const source = (0, logging_1.getSourceString)(F, concatenateFiles.name);
    validate.stringArgument(source, { sheetName });
    validate.arrayArgument(source, { targetExtensions, isNonEmptyString: typeValidation_1.isNonEmptyString });
    let files;
    if ((0, typeValidation_1.isNonEmptyArray)(arg1)) {
        files = arg1;
    }
    else if (isDirectory(arg1)) {
        files = getDirectoryFiles(arg1, ...targetExtensions);
    }
    else if (isFile(arg1)
        && (0, regex_1.stringEndsWithAnyOf)(arg1, targetExtensions, regex_1.RegExpFlagsEnum.IGNORE_CASE)) {
        files = [arg1];
    }
    else {
        let message = [`${source} Invalid parameter: 'arg1'`,
            `Expected: arg1: (Array<FileData | string> | string) to be one of:`,
            `files: FileData[] | filePaths: string[] | filePath: string | dirPath: string`,
            `Received: ${typeof arg1}`
        ].join(config_1.INDENT_LOG_LINE);
        config_1.typeshiLogger.error(message);
        throw new Error(message);
    }
    if (!(0, typeValidation_1.isNonEmptyArray)(files)) { // i.e. isEmptyArray.... shouldn't get here
        config_1.typeshiLogger.error(`${source} how did this happen, we're smarter than this`);
        return [];
    }
    else if (files.length === 1) {
        return await getRows(files[0], sheetName);
    } // else if files.length > 1, need to make sure each file has same headers
    const concatenatedRows = [];
    let haveDefinedRequiredHeaders = ((0, typeValidation_1.isNonEmptyArray)(requiredHeaders)
        && requiredHeaders.every(h => (0, typeValidation_1.isNonEmptyString)(h))
        ? true : false);
    for (const fileRepresentative of files) {
        const rows = await getRows(fileRepresentative, sheetName);
        if (!(0, typeValidation_1.isNonEmptyArray)(rows)) {
            continue;
        }
        if (!haveDefinedRequiredHeaders) {
            let firstValidRow = rows.find(row => !(0, typeValidation_1.isNullLike)(row));
            if (!firstValidRow) {
                continue;
            }
            requiredHeaders = Object.keys(firstValidRow);
            haveDefinedRequiredHeaders = true;
        }
        if (!(0, typeValidation_1.isNonEmptyArray)(requiredHeaders)) {
            config_1.typeshiLogger.warn(`${source} No requiredHeaders defined,`, `skipping file: '${(0, types_1.isFileData)(fileRepresentative)
                ? fileRepresentative.fileName : fileRepresentative}'`);
            continue;
        }
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!(0, typeValidation_1.hasKeys)(row, requiredHeaders)) {
                let missingHeaders = requiredHeaders.filter(h => !(0, typeValidation_1.hasKeys)(row, h));
                if (strictRequirement) {
                    let message = [`${source} Invalid row: missing required header(s)`,
                        `(strictRequirement === true)`,
                        `           file: '${(0, types_1.isFileData)(fileRepresentative)
                            ? fileRepresentative.fileName : fileRepresentative}'`,
                        `       rowIndex: ${i}`,
                        `requiredHeaders: ${JSON.stringify(requiredHeaders)}`,
                        ` missingHeaders: ${JSON.stringify(missingHeaders)}`
                    ].join(config_1.INDENT_LOG_LINE);
                    config_1.typeshiLogger.error(message);
                    throw new Error(message);
                }
                for (const header of missingHeaders) {
                    row[header] = '';
                }
            }
            concatenatedRows.push(row);
        }
    }
    return concatenatedRows;
}
/**
 * @param arg1 {@link FileData}` | string` one of the following:
 * - `fileData:` {@link FileData} = `{ fileName: string; fileContent: string; }`
 * - `filePath:` `string`
 * @param sheetName `string` `optional`
 * - defined/used `if` `arg1` pertains to an excel file and you want to specify which sheet to read
 * - `Default` = `'Sheet1'`
 * @returns **`rows`** `Promise<Record<string, any>[]>`
 */
async function getRows(arg1, sheetName = 'Sheet1') {
    if ((0, types_1.isFileData)(arg1)) {
        const { fileName } = arg1;
        if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            return getExcelRows(arg1, sheetName);
        }
        return getCsvRows(arg1);
    }
    else if ((0, typeValidation_1.isNonEmptyString)(arg1)) { // assume it's a file path
        if (arg1.endsWith('.xlsx') || arg1.endsWith('.xls')) {
            return getExcelRows(arg1, sheetName);
        }
        return getCsvRows(arg1);
    }
    else {
        throw new Error(`[reading.getRows()] Invalid argument: 'arg1' must be a FileData object or a string file path.`);
    }
}
/**
 * @note excludes empty rows
 * @param arg1
 * @param sheetName
 * @returns
 */
async function getExcelRows(arg1, sheetName = 'Sheet1') {
    const source = '[reading.getExcelRows()]';
    validate.stringArgument(source, { sheetName });
    let filePath;
    let fileContent;
    let buffer;
    if ((0, types_1.isFileData)(arg1) && (0, typeValidation_1.isNonEmptyString)(arg1.fileName)
        && (0, regex_1.stringEndsWithAnyOf)(arg1.fileName, ['.xlsx', '.xls'])) {
        filePath = arg1.fileName;
        fileContent = arg1.fileContent;
        buffer = Buffer.from(fileContent, 'base64');
    }
    else if ((0, typeValidation_1.isNonEmptyString)(arg1) && (0, regex_1.stringEndsWithAnyOf)(arg1, ['.xlsx', '.xls'])) {
        filePath = arg1;
        validate.existingPathArgument(`${source}.filePath`, { filePath });
        buffer = fs_1.default.readFileSync(filePath);
    }
    else {
        throw new Error([
            `${source} Invalid argument: 'arg1' (FileData or filePath)`,
            `must be a FileData object or a string file path.`,
            `Received: ${JSON.stringify(arg1)}`
        ].join(config_1.INDENT_LOG_LINE));
    }
    try {
        const workbook = xlsx_1.default.read(buffer, { type: 'buffer' });
        sheetName = (workbook.SheetNames.includes(sheetName)
            ? sheetName
            : workbook.SheetNames[0]);
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx_1.default.utils.sheet_to_json(sheet);
        return jsonData;
    }
    catch (error) {
        config_1.typeshiLogger.error([
            `${source} Error reading or parsing the Excel file.`,
            `Received arg1 = ${JSON.stringify(arg1)}, sheetName: '${sheetName}'`,
        ].join(config_1.INDENT_LOG_LINE), JSON.stringify(error, null, 4));
        return [];
    }
}
/**
 * @param filePath `string`
 * @returns **`rows`** `Promise<Record<string, any>[]>`
 * - an array of objects representing rows from a CSV file.
 */
async function getCsvRows(arg1) {
    const source = '[reading.getCsvRows()]';
    let filePath;
    let fileContent;
    let delimiter = types_1.DelimiterCharacterEnum.COMMA;
    let buffer;
    if ((0, types_1.isFileData)(arg1) && (0, typeValidation_1.isNonEmptyString)(arg1.fileName)
        && (0, regex_1.stringEndsWithAnyOf)(arg1.fileName, ['.csv', '.tsv'])) {
        filePath = arg1.fileName;
        fileContent = arg1.fileContent;
        buffer = Buffer.from(fileContent, 'base64');
        delimiter = getDelimiterFromFilePath(filePath);
    }
    else if ((0, typeValidation_1.isNonEmptyString)(arg1) && (0, regex_1.stringEndsWithAnyOf)(arg1, ['.csv', '.tsv'])) {
        filePath = arg1;
        validate.existingPathArgument(`${source}`, { filePath });
        try {
            buffer = fs_1.default.readFileSync(filePath);
        }
        catch (error) {
            throw new Error([
                `${source} Error making buffer when reading file: '${filePath}'`,
                `Error: ${error instanceof Error ? error.message : String(error)}`
            ].join(config_1.INDENT_LOG_LINE));
        }
        delimiter = getDelimiterFromFilePath(filePath);
    }
    else {
        throw new Error([
            `${source} Invalid argument: 'arg1' (FileData or filePath)`,
            `must be a FileData object or a string file path.`,
            `Received: ${JSON.stringify(arg1)}`
        ].join(config_1.INDENT_LOG_LINE));
    }
    const rows = [];
    if (!buffer) {
        throw new Error(`${source} No buffer available to read`);
    }
    const stream = stream_1.Readable.from(buffer.toString('utf8'));
    return new Promise((resolve, reject) => {
        stream
            .pipe((0, csv_parser_1.default)({ separator: delimiter }))
            .on('data', (row) => rows.push(row))
            .on('end', () => {
            config_1.SUPPRESSED_LOGS.push([`${source} Successfully read CSV file.`,
                `filePath: '${filePath}'`,
                `Number of rows read: ${rows.length}`
            ].join(config_1.INDENT_LOG_LINE));
            resolve(rows);
        })
            .on('error', (error) => {
            config_1.typeshiLogger.error(`${source} Error reading CSV file:`, config_1.INDENT_LOG_LINE + `filePath: '${filePath}'`, config_1.NEW_LINE + `Error: ${JSON.stringify(error, null, 4)}`);
            reject(error);
        });
    });
}
/**
 * @param arg1 `string | Record<string, any>[]` - the file path to a CSV file or an array of rows.
 * @param keyColumn `string` - the column name whose contents will be keys in the dictionary.
 * @param valueColumn `string` - the column name whose contents will be used as values in the dictionary.
 * @returns **`dict`** `Record<string, string>`
 */
async function getOneToOneDictionary(arg1, keyColumn, valueColumn, keyOptions, valueOptions) {
    const source = (0, logging_1.getSourceString)(F, getOneToOneDictionary.name);
    validate.multipleStringArguments(source, { keyColumn, valueColumn });
    let rows = await handleFileArgument(arg1, getOneToOneDictionary.name, [keyColumn, valueColumn]);
    const dict = {};
    for (const row of rows) {
        if (!(0, typeValidation_1.hasKeys)(row, [keyColumn, valueColumn])) {
            config_1.typeshiLogger.error(`${source} Row missing keys: '${keyColumn}' or '${valueColumn}'`);
            throw new Error(`${source} Row missing keys: '${keyColumn}' or '${valueColumn}'`);
        }
        const key = (0, regex_1.clean)(String(row[keyColumn]), keyOptions);
        const value = (0, regex_1.clean)(String(row[valueColumn]), valueOptions);
        if (!key || !value) {
            config_1.typeshiLogger.warn(`${source} Row missing key or value.`, config_1.INDENT_LOG_LINE + `keyColumn: '${keyColumn}', valueColumn: '${valueColumn}'`);
            continue;
        }
        if (dict[key]) {
            config_1.typeshiLogger.warn(`${source} Duplicate key found: '${key}'`, config_1.INDENT_LOG_LINE + `overwriting value '${dict[key]}' with '${value}'`);
        }
        dict[key] = value;
    }
    return dict;
}
/**
 * @param arg1 `string | FileData | Record<string, any>[]` - the `filePath` to a CSV file or an array of rows.
 * @param columnName `string` - the column name whose values will be returned.
 * @param allowDuplicates `boolean` - `optional` if `true`, allows duplicate values in the returned array, otherwise only unique values are returned.
 * - Defaults to `false`.
 * @returns **`values`** `Promise<Array<string>>` - sorted array of values (as strings) from the specified column.
 */
async function getColumnValues(arg1, columnName, cleaner, allowDuplicates = false) {
    const source = `[reading.getColumnValues()]`;
    validate.stringArgument(source, { columnName });
    validate.booleanArgument(source, { allowDuplicates });
    if (cleaner)
        validate.functionArgument(source, { cleaner });
    let rows = await handleFileArgument(arg1, getColumnValues.name, [columnName]);
    const values = [];
    for (const row of rows) {
        if (!(0, typeValidation_1.isNonEmptyString)(String(row[columnName])))
            continue;
        const value = (cleaner
            ? await cleaner(String(row[columnName]))
            : String(row[columnName])).trim();
        if (allowDuplicates || !values.includes(value)) {
            values.push(value);
        }
    }
    return values.sort();
}
/**
 * @param arg1 `string | FileData | Record<string, any>[]` - the `filePath` to a CSV file or an array of rows.
 * @param columnName `string` - the column name whose values will be returned.
 * @returns **`indexedColumnValues`** `Promise<Record<string, number[]>>`
 */
async function getIndexedColumnValues(arg1, columnName, cleaner) {
    const source = `[reading.getIndexedColumnValues()]`;
    validate.stringArgument(source, { columnName });
    if (cleaner)
        validate.functionArgument(source, { cleaner });
    let rows = await handleFileArgument(arg1, getIndexedColumnValues.name, [columnName]);
    const valueDict = {};
    for (const rowIndex in rows) {
        const row = rows[rowIndex];
        if (!(0, typeValidation_1.isNonEmptyString)(String(row[columnName])))
            continue;
        const value = (cleaner
            ? await cleaner(String(row[columnName]))
            : String(row[columnName])).trim();
        if (!valueDict[value]) {
            valueDict[value] = [];
        }
        valueDict[value].push(Number(rowIndex));
    }
    return valueDict;
}
/**
 * @param arg1 `string | FileData | Record<string, any>[]`
 * @param invocationSource `string`
 * @param requiredHeaders `string[]` `optional`
 * @returns **`rows`** `Promise<Record<string, any>[]>`
 */
async function handleFileArgument(arg1, invocationSource, requiredHeaders = [], sheetName) {
    const source = (0, logging_1.getSourceString)(F, handleFileArgument.name);
    validate.stringArgument(source, { invocationSource });
    validate.arrayArgument(source, { requiredHeaders, isNonEmptyString: typeValidation_1.isNonEmptyString }, true);
    let rows = [];
    // Handle file path validation only for string inputs
    if ((0, typeValidation_1.isNonEmptyString)(arg1)
        && (0, regex_1.stringEndsWithAnyOf)(arg1, /(\.tsv|\.csv)/i)
        && !isValidCsvSync(arg1, requiredHeaders)) {
        throw new Error([
            `${source} Invalid CSV filePath provided: '${arg1}'`,
            `invocationSource: ${invocationSource}`,
            `requiredHeaders ? ${(0, typeValidation_1.isNonEmptyArray)(requiredHeaders)
                ? JSON.stringify(requiredHeaders)
                : 'none provided'}`
        ].join(config_1.INDENT_LOG_LINE));
    }
    if (((0, typeValidation_1.isNonEmptyString)(arg1) && isFile(arg1)) // arg1 is file path string
        || (0, types_1.isFileData)(arg1)) { // arg1 is FileData { fileName: string; fileContent: string; }
        rows = await getRows(arg1, sheetName);
    }
    else if ((0, typeValidation_1.isNonEmptyArray)(arg1)) { // arg1 is already array of rows
        if (arg1.some(v => !(0, typeValidation_1.isObject)(v))) {
            throw new Error([
                `${source} Error: Invalid 'arg1' (Record<string, any>[]) param:`,
                `There exists an element in the row array that is not an object.`,
                `Source: ${invocationSource}`,
            ].join(config_1.INDENT_LOG_LINE));
        }
        rows = arg1;
    }
    else {
        throw new Error([
            `${source} Invalid parameter: 'arg1' (string | FileData | Record<string, any>[])`,
            `arg1 must be a file path string, FileData object, or an array of rows.`,
            `Source: ${invocationSource}`,
        ].join(config_1.INDENT_LOG_LINE));
    }
    return rows;
}
/**
 * @param dir `string` path to target directory
 * @param targetExtensions `string[] optional` - array of file extensions to filter files by.
 * - `If` not provided, all files in the directory will be returned.
 * - `If` provided, only files with extensions matching the array will be returned.
 * @returns **`targetFiles`** `string[]` array of full file paths
 */
function getDirectoryFiles(dir, ...targetExtensions) {
    const source = (0, logging_1.getSourceString)(F, getDirectoryFiles.name);
    validate.existingPathArgument(source, { dir });
    validate.arrayArgument(source, { targetExtensions, isNonEmptyString: typeValidation_1.isNonEmptyString }, true);
    // ensure all target extensions start with period
    for (let i = 0; i < targetExtensions.length; i++) {
        const ext = targetExtensions[i];
        if (!ext.startsWith('.')) {
            targetExtensions[i] = `.${ext}`;
        }
    }
    const targetFiles = fs_1.default.readdirSync(dir).filter(f => (0, typeValidation_1.isNonEmptyArray)(targetExtensions)
        ? true // get all files in dir, regardless of extension
        : (0, regex_1.stringEndsWithAnyOf)(f, targetExtensions, regex_1.RegExpFlagsEnum.IGNORE_CASE)).map(file => node_path_1.default.join(dir, file));
    return targetFiles;
}
/**
 * @param dataSource `string | FileData | Record<string, any>[]`
 * @param keyColumn `string`
 * @param valueColumn `string`
 * @param keyOptions {@link CleanStringOptions} `(optional)`
 * @param valueOptions {@link CleanStringOptions}`(optional)`
 * @param sheetName `string`
 * @returns **`dict`** `Promise<Record<string, string[]>>`
 */
async function getOneToManyDictionary(dataSource, keyColumn, valueColumn, keyOptions, valueOptions, sheetName) {
    const source = (0, logging_1.getSourceString)(F, getOneToManyDictionary.name);
    validate.multipleStringArguments(source, { keyColumn, valueColumn });
    if (keyOptions)
        validate.objectArgument(source, { keyOptions, isCleanStringOptions: regex_1.isCleanStringOptions });
    if (valueOptions)
        validate.objectArgument(source, { valueOptions, isCleanStringOptions: regex_1.isCleanStringOptions });
    const rows = await handleFileArgument(dataSource, source, [keyColumn, valueColumn], sheetName);
    const dict = {};
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let key = (0, regex_1.clean)(row[keyColumn], keyOptions).trim().replace(/\.$/, '');
        if (!dict[key]) {
            dict[key] = [];
        }
        let value = (0, regex_1.clean)(row[valueColumn], valueOptions).trim().replace(/\.$/, '');
        if (!dict[key].includes(value)) {
            dict[key].push(value);
        }
    }
    return dict;
}
/**
 * @deprecated -> use {@link getOneToManyDictionary}
 * @param filePath `string`
 * @param sheetName `string`
 * @param keyColumn `string`
 * @param valueColumn `string`
 * @param options - {@link ParseOneToManyOptions}
 * = `{ keyStripOptions`?: {@link StringStripOptions}, `valueStripOptions`?: {@link StringStripOptions}, keyCaseOptions`?: {@link StringCaseOptions}, `valueCaseOptions`?: {@link StringCaseOptions}, `keyPadOptions`?: {@link StringPadOptions}, `valuePadOptions`?: {@link StringPadOptions} `}`
 * - {@link StringStripOptions} = `{ char`: `string`, `escape`?: `boolean`, `stripLeftCondition`?: `(s: string, ...args: any[]) => boolean`, `leftArgs`?: `any[]`, `stripRightCondition`?: `(s: string, ...args: any[]) => boolean`, `rightArgs`?: `any[] }`
 * - {@link StringCaseOptions} = `{ toUpper`?: `boolean`, `toLower`?: `boolean`, `toTitle`?: `boolean }`
 * - {@link StringPadOptions} = `{ padLength`: `number`, `padChar`?: `string`, `padLeft`?: `boolean`, `padRight`?: `boolean }`
 * @returns **`dict`** `Record<string, Array<string>>` — key-value pairs where key is from `keyColumn` and value is an array of values from `valueColumn`
 */
function parseExcelForOneToMany(filePath, sheetName, keyColumn, valueColumn, options = {}) {
    filePath = coerceFileExtension(filePath, 'xlsx');
    validate.multipleStringArguments(`reading.parseExcelForOneToMany`, { filePath, sheetName, keyColumn, valueColumn });
    try {
        const { keyStripOptions, valueStripOptions, keyCaseOptions, valueCaseOptions, keyPadOptions, valuePadOptions } = options;
        const workbook = xlsx_1.default.readFile(filePath);
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx_1.default.utils.sheet_to_json(sheet);
        const dict = {};
        jsonData.forEach(row => {
            let key = (0, regex_1.clean)(String(row[keyColumn]), keyStripOptions, keyCaseOptions, keyPadOptions).trim().replace(/\.$/, '');
            let val = (0, regex_1.clean)(String(row[valueColumn]), valueStripOptions, valueCaseOptions, valuePadOptions).trim().replace(/\.$/, '');
            if (!dict[key]) {
                dict[key] = [];
            }
            if (!dict[key].includes(val)) {
                dict[key].push(val);
            }
        });
        return dict;
    }
    catch (err) {
        config_1.typeshiLogger.error('Error reading or parsing the Excel file:', err, config_1.INDENT_LOG_LINE + 'Given File Path:', '"' + filePath + '"');
        return {};
    }
}
/**
 * @deprecated -> use {@link getOneToManyDictionary}
 * @param filePath `string`
 * @param keyColumn `string`
 * @param valueColumn `string`
 * @param delimiter {@link DelimiterCharacters} | `string`
 * @param options {@link ParseOneToManyOptions}
 * = `{ keyCaseOptions`?: {@link StringCaseOptions}, `valueCaseOptions`?: {@link StringCaseOptions}, `keyPadOptions`?: {@link StringPadOptions}, `valuePadOptions`?: {@link StringPadOptions} `}`
 * - {@link StringCaseOptions} = `{ toUpper`?: `boolean`, `toLower`?: `boolean`, `toTitle`?: `boolean }`
 * - {@link StringPadOptions} = `{ padLength`: `number`, `padChar`?: `string`, `padLeft`?: `boolean`, `padRight`?: `boolean }`
 * @returns `Record<string, Array<string>>` - key-value pairs where key is from `keyColumn` and value is an array of values from `valueColumn`
 */
function parseCsvForOneToMany(filePath, keyColumn, valueColumn, delimiter = types_1.DelimiterCharacterEnum.COMMA, options = {}) {
    filePath = coerceFileExtension(filePath, (delimiter === types_1.DelimiterCharacterEnum.TAB) ? 'tsv' : 'csv');
    const source = `[reading.parseCsvForOneToMany()]`;
    validate.existingFileArgument(source, ['.tsv', '.csv'], { filePath });
    validate.multipleStringArguments(source, { keyColumn, valueColumn });
    try {
        const { keyStripOptions, valueStripOptions, keyCaseOptions, valueCaseOptions, keyPadOptions, valuePadOptions } = options;
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        const lines = data.split('\n');
        const dict = {};
        const header = lines[0].split(delimiter).map(col => col.trim());
        const keyIndex = header.indexOf(keyColumn);
        const valueIndex = header.indexOf(valueColumn);
        if (keyIndex === -1 || valueIndex === -1) {
            throw new Error(`Key or value column not found in CSV file.`);
        }
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].split(delimiter).map(col => col.trim());
            if (line.length > 1) {
                let key = (0, regex_1.clean)(line[keyIndex], keyStripOptions, keyCaseOptions, keyPadOptions);
                let val = (0, regex_1.clean)(line[valueIndex], valueStripOptions, valueCaseOptions, valuePadOptions);
                if (!dict[key]) {
                    dict[key] = [];
                }
                if (!dict[key].includes(val)) {
                    dict[key].push(val);
                }
            }
        }
        return dict;
    }
    catch (err) {
        config_1.typeshiLogger.error('Error reading or parsing the CSV file:', err, config_1.INDENT_LOG_LINE + 'Given File Path:', '"' + filePath + '"');
        return {};
    }
}
const DEFAULT_CSV_VALIDATION_RULES = {
    allowEmptyRows: true,
    allowInconsistentColumns: true,
    maxRowsToCheck: Infinity,
};
/**
 * @notimplemented
 * @TODO
 * @param arg1
 * @param requiredHeaders
 * @param options
 * @returns
 */
async function isValidCsv(arg1, requiredHeaders, options = DEFAULT_CSV_VALIDATION_RULES) {
    return false;
}
/**
 * @problem has trouble handling case where column value contains a single double quote;
 * e.g. when it's used as the inches unit after a number
 *
 * `sync`
 * @param filePath `string` - must be a string to an existing file, otherwise return `false`.
 * @param requiredHeaders `string[]` - `optional` array of headers that must be present in the CSV file.
 * - If provided, the function checks if all required headers are present in the CSV header row
 * @param options `object` - optional configuration
 * - `allowEmptyRows`: `boolean` - if true, allows rows with all empty fields (default: true)
 * - `allowInconsistentColumns`: `boolean` - if true, allows rows with different column counts (default: false)
 * - `maxRowsToCheck`: `number` - maximum number of rows to validate (default: all rows)
 * @returns **`isValidCsv`** `boolean`
 * - **`true`** `if` the CSV file at `filePath` is valid (proper structure and formatting),
 * - **`false`** `otherwise`.
 */
function isValidCsvSync(filePath, requiredHeaders, options = DEFAULT_CSV_VALIDATION_RULES) {
    const { allowEmptyRows = true, allowInconsistentColumns = false, maxRowsToCheck = Infinity } = options;
    validate.existingPathArgument(`reading.isValidCsv`, { filePath });
    try {
        const delimiter = getDelimiterFromFilePath(filePath);
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        // Handle different line endings
        const normalizedData = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        // Split into lines, but be careful about quoted fields with newlines
        let lines = [];
        let currentLine = '';
        let inQuotes = false;
        let i = 0;
        while (i < normalizedData.length) {
            const char = normalizedData[i];
            const nextChar = normalizedData[i + 1];
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    currentLine += '""';
                    i++; // Skip next quote
                }
                else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                    currentLine += char;
                }
            }
            else if (char === '\n' && !inQuotes) {
                // End of line (not within quotes)
                if (currentLine.trim() !== '' || allowEmptyRows) {
                    lines.push(currentLine);
                }
                currentLine = '';
            }
            else {
                currentLine += char;
            }
            i++;
        }
        // Add the last line if it exists
        if (currentLine.trim() !== '' || allowEmptyRows) {
            lines.push(currentLine);
        }
        if (lines.length < 1) {
            config_1.typeshiLogger.error(`[ERROR isValidCsv()]: file has no valid lines: ${filePath}`);
            return false;
        }
        const headerRow = parseCsvLine(lines[0], delimiter);
        if (headerRow.length < 1) {
            config_1.typeshiLogger.error(`[ERROR isValidCsv()]: no header found in file: ${filePath}`);
            return false;
        }
        // Check for empty headers
        if (headerRow.some(header => header === '')) {
            config_1.typeshiLogger.warn(`[isValidCsv()]: Found empty header(s) in file: ${filePath}`);
            if (!allowInconsistentColumns) {
                return false;
            }
        }
        // Validate required headers
        if ((0, typeValidation_1.isNonEmptyArray)(requiredHeaders)) {
            const hasRequiredHeaders = requiredHeaders.every(header => {
                if (!(0, typeValidation_1.isNonEmptyString)(header)) {
                    config_1.typeshiLogger.warn([
                        `[reading.isValidCsv]: Invalid parameter: 'requiredHeaders'`,
                        `requiredHeaders must be of type: Array<string>`,
                        `found array element of type: '${typeof header}' (skipping)`
                    ].join(config_1.INDENT_LOG_LINE));
                    return true; // skip headers if they are not strings
                }
                return headerRow.includes(header);
            });
            if (!hasRequiredHeaders) {
                config_1.typeshiLogger.warn([
                    `[isValidCsv()]: Required headers missing from headerRow`,
                    `filePath: '${filePath}'`,
                    `requiredHeaders: ${JSON.stringify(requiredHeaders)}`,
                    `csvFileHeaders: ${JSON.stringify(headerRow)}`
                ].join(config_1.INDENT_LOG_LINE));
                return false;
            }
        }
        // Check consistency of data rows
        const maxRows = Math.min(lines.length, maxRowsToCheck + 1); // +1 for header
        const expectedColumnCount = headerRow.length;
        for (let i = 1; i < maxRows; i++) {
            const line = lines[i];
            // Skip completely empty lines if allowed
            if (allowEmptyRows && line.trim() === '') {
                continue;
            }
            const rowValues = parseCsvLine(line, delimiter);
            // Check if row is empty (all fields are empty)
            const isEmptyRow = rowValues.every(val => val === '');
            if (isEmptyRow && allowEmptyRows) {
                continue;
            }
            // Check column count consistency
            if (rowValues.length !== expectedColumnCount && !allowInconsistentColumns) {
                config_1.typeshiLogger.warn([
                    `[isValidCsv()]: Invalid row found: header.length !== rowValues.length`,
                    `   header.length: ${expectedColumnCount}`,
                    `rowValues.length: ${rowValues.length}`,
                    ` -> Difference =  ${expectedColumnCount - rowValues.length}`,
                    `   header:  ${JSON.stringify(headerRow)}`,
                    // `rowValues: ${JSON.stringify(rowValues)}`,
                    ` rowIndex:  ${i}`,
                    ` filePath: '${filePath}'`,
                    `delimiter: '${delimiter}'`
                ].join(config_1.INDENT_LOG_LINE));
                return false;
            }
        }
        return true;
    }
    catch (error) {
        config_1.typeshiLogger.error([
            `[isValidCsv()]: Error reading or parsing CSV file: ${filePath}`,
            `Error: ${error instanceof Error ? error.message : String(error)}`
        ].join(config_1.INDENT_LOG_LINE));
        return false;
    }
}
/**
 * Parses a CSV line into fields, properly handling quoted fields with embedded delimiters, quotes, and newlines
 * @param line `string` - the CSV line to parse
 * @param delimiter `string` - the delimiter character
 * @returns **`fields`** `string[]` - array of field values
 */
function parseCsvLine(line, delimiter) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    while (i < line.length) {
        const char = line[i];
        const nextChar = line[i + 1];
        if (!inQuotes) {
            if (char === '"') {
                inQuotes = true;
            }
            else if (char === delimiter) {
                fields.push(current.trim());
                current = '';
            }
            else {
                current += char;
            }
        }
        else {
            if (char === '"') {
                if (nextChar === '"') {
                    // Escaped quote within quoted field
                    current += '"';
                    i++; // Skip the next quote
                }
                else {
                    // End of quoted field
                    inQuotes = false;
                }
            }
            else {
                current += char;
            }
        }
        i++;
    }
    // Add the last field
    fields.push(current.trim());
    return fields;
}
/**
 * Analyzes a CSV file and returns detailed validation information
 * @param filePath `string` - path to the CSV file
 * @param options `object` - validation options
 * @returns **`analysis`** `object` - detailed analysis of the CSV file
 */
function analyzeCsv(filePath, options = {}) {
    const { sampleSize = 1000, checkEncoding = false, detectDelimiter = false } = options;
    const issues = [];
    const warnings = [];
    const stats = {
        totalRows: 0,
        headerCount: 0,
        maxRowLength: 0,
        minRowLength: Infinity,
        emptyRows: 0,
        encoding: null,
        detectedDelimiter: null
    };
    let headers = [];
    try {
        validate.existingPathArgument(`reading.analyzeCsv`, { filePath });
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        const normalizedData = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        // Detect delimiter if requested
        let delimiter;
        if (detectDelimiter) {
            const commonDelimiters = [',', '\t', ';', '|'];
            const delimiterCounts = commonDelimiters.map(delim => ({
                delimiter: delim,
                count: (data.match(new RegExp(`\\${delim}`, 'g')) || []).length
            }));
            const mostLikely = delimiterCounts.sort((a, b) => b.count - a.count)[0];
            delimiter = mostLikely.count > 0 ? mostLikely.delimiter : getDelimiterFromFilePath(filePath);
            stats.detectedDelimiter = delimiter;
        }
        else {
            delimiter = getDelimiterFromFilePath(filePath);
        }
        // Parse the file properly
        let lines = [];
        let currentLine = '';
        let inQuotes = false;
        let i = 0;
        while (i < normalizedData.length) {
            const char = normalizedData[i];
            const nextChar = normalizedData[i + 1];
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    currentLine += '""';
                    i++;
                }
                else {
                    inQuotes = !inQuotes;
                    currentLine += char;
                }
            }
            else if (char === '\n' && !inQuotes) {
                lines.push(currentLine);
                currentLine = '';
            }
            else {
                currentLine += char;
            }
            i++;
        }
        if (currentLine) {
            lines.push(currentLine);
        }
        stats.totalRows = lines.length;
        if (lines.length === 0) {
            issues.push('File is empty');
            return { isValid: false, issues, warnings, stats, headers };
        }
        headers = parseCsvLine(lines[0], delimiter);
        stats.headerCount = headers.length;
        stats.maxRowLength = headers.length;
        stats.minRowLength = headers.length;
        // Check for duplicate headers
        const headerSet = new Set(headers);
        if (headerSet.size !== headers.length) {
            warnings.push('Duplicate header names found');
        }
        // Check for empty headers
        if (headers.some(h => h.trim() === '')) {
            warnings.push('Empty header names found');
        }
        // Analyze data rows (sample if necessary)
        const rowsToCheck = Math.min(lines.length - 1, sampleSize);
        const step = rowsToCheck < lines.length - 1 ? Math.floor((lines.length - 1) / rowsToCheck) : 1;
        let inconsistentRows = 0;
        for (let i = 1; i < lines.length; i += step) {
            const line = lines[i];
            if (line.trim() === '') {
                stats.emptyRows++;
                continue;
            }
            const fields = parseCsvLine(line, delimiter);
            stats.maxRowLength = Math.max(stats.maxRowLength, fields.length);
            stats.minRowLength = Math.min(stats.minRowLength, fields.length);
            if (fields.length !== headers.length) {
                inconsistentRows++;
            }
        }
        if (inconsistentRows > 0) {
            warnings.push(`${inconsistentRows} rows have inconsistent column counts`);
        }
        if (stats.emptyRows > 0) {
            warnings.push(`${stats.emptyRows} empty rows found`);
        }
        // Encoding detection (basic)
        if (checkEncoding) {
            try {
                const buffer = fs_1.default.readFileSync(filePath);
                const hasUtf8Bom = buffer.length >= 3 &&
                    buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF;
                stats.encoding = hasUtf8Bom ? 'UTF-8 with BOM' : 'UTF-8';
            }
            catch (error) {
                warnings.push('Could not detect file encoding');
            }
        }
        const isValid = issues.length === 0;
        return { isValid, issues, warnings, stats, headers };
    }
    catch (error) {
        issues.push(`Error analyzing file: ${error instanceof Error ? error.message : String(error)}`);
        return { isValid: false, issues, warnings, stats, headers };
    }
}
/**
 * Attempts to repair common CSV formatting issues
 * @param filePath `string` - path to the CSV file to repair
 * @param outputPath `string` - path where the repaired CSV will be saved
 * @param options `object` - repair options
 * @returns **`repairResult`** `object` - result of the repair operation
 */
function repairCsv(filePath, outputPath, options = {}) {
    const { fixQuoting = true, removeEmptyRows = true, standardizeLineEndings = true, fillMissingColumns = true, fillValue = '' } = options;
    const repairsMade = [];
    const errors = [];
    try {
        validate.existingPathArgument(`reading.repairCsv`, { filePath });
        validate.stringArgument(`reading.repairCsv`, { outputPath });
        const delimiter = getDelimiterFromFilePath(filePath);
        let data = fs_1.default.readFileSync(filePath, 'utf8');
        // Standardize line endings
        if (standardizeLineEndings) {
            const originalData = data;
            data = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            if (originalData !== data) {
                repairsMade.push('Standardized line endings');
            }
        }
        // Parse lines properly
        let lines = [];
        let currentLine = '';
        let inQuotes = false;
        let i = 0;
        while (i < data.length) {
            const char = data[i];
            const nextChar = data[i + 1];
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    currentLine += '""';
                    i++;
                }
                else {
                    inQuotes = !inQuotes;
                    currentLine += char;
                }
            }
            else if (char === '\n' && !inQuotes) {
                lines.push(currentLine);
                currentLine = '';
            }
            else {
                currentLine += char;
            }
            i++;
        }
        if (currentLine) {
            lines.push(currentLine);
        }
        if (lines.length === 0) {
            errors.push('File is empty');
            return { success: false, repairsMade, errors };
        }
        // Get expected column count from header
        const headerFields = parseCsvLine(lines[0], delimiter);
        const expectedColumnCount = headerFields.length;
        // Process each line
        const repairedLines = [];
        let emptyRowsRemoved = 0;
        let rowsWithMissingColumns = 0;
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            // Skip empty rows if requested
            if (removeEmptyRows && line.trim() === '') {
                emptyRowsRemoved++;
                continue;
            }
            let fields = parseCsvLine(line, delimiter);
            // Fill missing columns
            if (fillMissingColumns && fields.length < expectedColumnCount) {
                while (fields.length < expectedColumnCount) {
                    fields.push(fillValue);
                }
                rowsWithMissingColumns++;
            }
            // Reconstruct line with proper quoting
            const repairedLine = fields.map(field => {
                // Escape quotes and wrap in quotes if needed
                if (field.includes(delimiter) || field.includes('\n') || field.includes('"')) {
                    const escapedField = field.replace(/"/g, '""');
                    return `"${escapedField}"`;
                }
                return field;
            }).join(delimiter);
            repairedLines.push(repairedLine);
        }
        // Record repairs made
        if (emptyRowsRemoved > 0) {
            repairsMade.push(`Removed ${emptyRowsRemoved} empty rows`);
        }
        if (rowsWithMissingColumns > 0) {
            repairsMade.push(`Fixed ${rowsWithMissingColumns} rows with missing columns`);
        }
        // Write repaired file
        const repairedData = repairedLines.join('\n');
        fs_1.default.writeFileSync(outputPath, repairedData, 'utf8');
        return { success: true, repairsMade, errors };
    }
    catch (error) {
        errors.push(`Error repairing CSV: ${error instanceof Error ? error.message : String(error)}`);
        return { success: false, repairsMade, errors };
    }
}
/** paths to folders or files */
async function validatePath(...paths) {
    for (const path of paths) {
        if (!fs_1.default.existsSync(path)) {
            throw new Error(`[ERROR reading.validatePath()]: path does not exist: ${path}`);
        }
    }
}
/**
 * @param rowSource `string | Record<string, any>[]`
 * @param targetColumn `string`
 * @param targetValues `string[]`
 * @param extractor `function (columnValue: string, ...args: any[]) => string`
 * @param extractorArgs `any[]`
 * @returns **`targetRows`** `Promise<Record<string, any>[]>`
 * - array of all rows where either `row[targetColumn]` or `extractor(row[targetColumn])` is in `targetValues`
 */
async function extractTargetRows(
/**
 * - `string` -> filePath to a csv file
 * - `Record<string, any>[]` -> array of rows
 * */
rowSource, targetColumn, targetValues, extractor, extractorArgs) {
    const source = (0, logging_1.getSourceString)(F, extractTargetRows.name);
    if (!(0, typeValidation_1.isNonEmptyString)(rowSource) && !(0, typeValidation_1.isNonEmptyArray)(rowSource)) {
        throw new Error([`${source} Invalid param 'rowSource'`,
            `Expected rowSource: string | Record<string, any>[]`,
            `Received rowSource: '${typeof rowSource}'`
        ].join(config_1.INDENT_LOG_LINE));
    }
    validate.stringArgument(source, { targetColumn });
    if (extractor !== undefined)
        validate.functionArgument(source, { extractor });
    validate.arrayArgument(source, { targetValues, isNonEmptyString: typeValidation_1.isNonEmptyString });
    const sourceRows = await handleFileArgument(rowSource, extractTargetRows.name, [targetColumn]);
    const remainingValues = [];
    let potentials = {};
    let valuesFound = [];
    const targetRows = [];
    for (let i = 0; i < sourceRows.length; i++) {
        const row = sourceRows[i];
        if (!(0, typeValidation_1.hasKeys)(row, targetColumn)) {
            config_1.typeshiLogger.warn([`${source} row does not have provided targetColumn`,
                `    targetColumn: '${targetColumn}'`,
                `Object.keys(row):  ${JSON.stringify(Object.keys(row))}`,
            ].join(config_1.INDENT_LOG_LINE));
            continue;
        }
        const originalValue = String(row[targetColumn]);
        if (targetValues.includes(originalValue)) {
            targetRows.push(row);
            if (!valuesFound.includes(originalValue))
                valuesFound.push(originalValue);
            // slog.debug(`${source} ORIGINAL VALUE IN TARGET VALUES`)
            continue;
        }
        if (!extractor) {
            continue;
        }
        const extractedValue = await extractor(originalValue, extractorArgs);
        if (!(0, typeValidation_1.isNonEmptyString)(extractedValue)) {
            // slog.warn([`${source} extractor(value) returned invalid string`,
            //     ` originalValue: '${originalValue}'`, 
            //     `rowSource type: '${typeof rowSource}'`
            // ].join(TAB));
            continue;
        }
        if (targetValues.includes(extractedValue)) {
            targetRows.push(row);
            if (!valuesFound.includes(extractedValue))
                valuesFound.push(extractedValue);
            continue;
        }
        let targetMatch = targetValues.find(v => {
            v = v.toUpperCase();
            return v.startsWith(extractedValue.toUpperCase());
        });
        if (targetMatch) {
            if (!potentials[targetMatch]) {
                potentials[targetMatch] = [i];
            }
            else {
                potentials[targetMatch].push(i);
            }
            // slog.debug([`${source} Found potentialMatch for a targetValue at rowIndex ${i}`,
            //     ` originalValue: '${originalValue}'`, 
            //     `extractedValue: '${extractedValue}'`, 
            //     `potentialMatch: '${targetMatch}'`, 
            // ].join(TAB));
        }
    }
    remainingValues.push(...targetValues.filter(v => !valuesFound.includes(v)));
    // if (remainingValues.length > 0) {
    //     mlog.warn([`${source} ${remainingValues.length} value(s) from targetValues did not have a matching row`,
    //         // indentedStringify(remainingValues)
    //     ].join(TAB));
    //     write({remainingValues}, path.join(CLOUD_LOG_DIR, `${getFileNameTimestamp()}_remainingValues.json`))
    // }
    return { rows: targetRows, remainingValues };
}
/**
 * @param extantValues `string[]`
 * @param csvFiles `string[] | FileData[] | Record<string, any>[][]`
 * @param column `string`
 * @param extractor `(columnValue: string, ...args: any[]) => string | Promise<string>`
 * @param extractorArgs `any[]`
 * @returns **`missingValues`** `Promise<string[][]>`
 * where `missingValues[i]` is the array of values
 * that are found in `csvFiles[i][column]` but not in `extantValues`
 */
async function findMissingValues(extantValues, csvFiles, column, extractor, extractorArgs = []) {
    const source = (0, logging_1.getSourceString)(__filename, findMissingValues.name);
    const missingValues = [];
    for (let i = 0; i < csvFiles.length; i++) {
        const rowSource = csvFiles[i];
        missingValues[i] = [];
        const columnValues = await getColumnValues(rowSource, column);
        for (const originalValue of columnValues) {
            const extractedValue = await extractor(originalValue, ...extractorArgs);
            if (!(0, typeValidation_1.isNonEmptyString)(extractedValue)) {
                config_1.typeshiSimpleLogger.warn([`${source} extractor(value) returned invalid string`,
                    `originalValue: '${originalValue}'`,
                ].join(config_1.INDENT_LOG_LINE));
                if (!missingValues[i].includes(originalValue)) {
                    missingValues[i].push(originalValue);
                }
                continue;
            }
            if (!extantValues.includes(extractedValue)
                && !missingValues[i].includes(extractedValue)) {
                missingValues[i].push(extractedValue);
            }
        }
    }
    return missingValues;
}
