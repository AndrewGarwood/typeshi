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
exports.readJsonSyncOrThrow = readJsonSyncOrThrow;
exports.readFileToArraySync = readFileToArraySync;
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
const config_1 = require("../../config");
const types_1 = require("./types");
const typeValidation_1 = require("../typeValidation");
const validate = __importStar(require("../argumentValidation"));
const logging_1 = require("./logging");
/** checks if `pathString (value)` points to an existing directory */
function isDirectory(value) {
    return ((0, typeValidation_1.isNonEmptyString)(value)
        && fs_1.default.existsSync(value)
        && fs_1.default.statSync(value).isDirectory());
}
/** checks if `pathString (value)` points to an existing file */
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
 * @returns **`jsonData`** — `T extends Record<string, any>` - JSON data as an object
 * @note returns empty object if error occurred while reading `filepath` or parsing json
 * - use {@link readJsonSyncOrThrow} if throwing error is desired behavior
 */
exports.readJsonSync = readJsonFileAsObject;
/**
 * a.k.a. `readJsonSync`
 * @param filePath `string`
 * @returns **`jsonData`** — `T extends Record<string, any>` - JSON data as an object
 * @note returns empty object if error occurred while reading `filepath` or parsing json
 * - use {@link readJsonSyncOrThrow} if throwing error is desired behavior
 */
function readJsonFileAsObject(filePath) {
    const source = (0, logging_1.getSourceString)(__filename, readJsonFileAsObject.name);
    try {
        filePath = coerceFileExtension(filePath, 'json');
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    }
    catch (error) {
        config_1.typeshiLogger.error([`${source} Error reading JSON file, returning empty object`,
            `Given filePath: '${filePath}'`,
            `caught error: ${error}`,
        ].join(config_1.INDENT_LOG_LINE));
        return {};
    }
}
/**
 * @param filePath `string`
 * @returns **`jsonData`** — `T extends Record<string, any>`
 * @throws {Error} if error occurred while reading `filepath` or parsing json
 */
function readJsonSyncOrThrow(filePath) {
    const source = (0, logging_1.getSourceString)(__filename, readJsonSyncOrThrow.name);
    try {
        filePath = coerceFileExtension(filePath, 'json');
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    }
    catch (error) {
        config_1.typeshiLogger.error([`${source} Error reading JSON file`,
            `Given filePath: '${filePath}'`,
            `caught error: ${error}`,
        ].join(config_1.INDENT_LOG_LINE));
        throw new Error(JSON.stringify(error));
    }
}
/**
 * @param filePath `string`
 * @param separator `string | RegExp` `default` = `/\r?\n/` (i.e. each line is an individual element in the array)
 * @param encoding {@link BufferEncoding} `default` = `'utf8'`
 * @returns **`arr`** `string[]` - the file content separated by specified param value
 * - returns empty array if error occurs while reading file.
 */
function readFileToArraySync(filePath, separator = /\r?\n/, encoding = 'utf8') {
    const source = (0, logging_1.getSourceString)(__filename, readFileToArraySync.name);
    try {
        const content = fs_1.default.readFileSync(filePath, { encoding });
        return content.split(separator);
    }
    catch (error) {
        config_1.typeshiLogger.error([`${source} Error reading file, returning empty array`,
            `Given filePath: '${filePath}'`,
            `caught error: ${error}`,
        ].join(config_1.INDENT_LOG_LINE));
        return [];
    }
}
/**
 * @description adds `'.${expectedExtension}'` to end of `filePath` if not already present
 * @param filePath `string`
 * @param expectedExtension `string | `{@link FileExtension}
 * @returns **`validatedFilePath`** `string`
 */
function coerceFileExtension(filePath, expectedExtension) {
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
    const source = (0, logging_1.getSourceString)(__filename, concatenateFiles.name);
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
            let firstValidRow = rows.find(row => !(0, typeValidation_1.isEmpty)(row));
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
                    (row)[header] = '';
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
    const source = (0, logging_1.getSourceString)(__filename, getCsvRows.name);
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
            config_1.typeshiHiddenLogger.debug([`${source} Successfully read CSV file.`,
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
async function getOneToOneDictionary(arg1, keyColumn, valueColumn, keyOptions, valueOptions, requireIncludeAllRows = false) {
    const source = (0, logging_1.getSourceString)(__filename, getOneToOneDictionary.name);
    try {
        validate.multipleStringArguments(source, { keyColumn, valueColumn });
        let rows = await handleFileArgument(arg1, getOneToOneDictionary.name, [keyColumn, valueColumn]);
        const dict = {};
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!(0, typeValidation_1.hasKeys)(row, [keyColumn, valueColumn])) {
                let msg = [`${source} row @ index ${i} missing key(s): '${keyColumn}', '${valueColumn}'`,
                    `  keyColumn: '${keyColumn}' in row ? ${keyColumn in row} -> row[keyColumn] = '${row[keyColumn]}'`,
                    `valueColumn: '${valueColumn}' in row ? ${valueColumn in row} -> row[valueColumn] = '${row[valueColumn]}'`,
                ].join(config_1.INDENT_LOG_LINE);
                if (requireIncludeAllRows)
                    throw new Error(msg);
                config_1.typeshiLogger.warn(msg);
                continue;
            }
            const key = (0, regex_1.clean)(String(row[keyColumn]), keyOptions);
            const value = (0, regex_1.clean)(String(row[valueColumn]), valueOptions);
            if (!key || !value) {
                let msg = [`${source} Row @ index ${i} missing key or value.`,
                    `  keyColumn: '${keyColumn}' in row ? ${keyColumn in row}`,
                    `->   row[keyColumn] = '${row[keyColumn]}'`,
                    `    clean(String(row[keyColumn]), keyOptions): '${key}'`,
                    `valueColumn: '${valueColumn}' in row ? ${valueColumn in row}`,
                    `-> row[valueColumn] = '${row[valueColumn]}'`,
                    `clean(String(row[valueColumn]), valueOptions): '${value}'`,
                ].join(config_1.INDENT_LOG_LINE);
                if (requireIncludeAllRows)
                    throw new Error(msg);
                config_1.typeshiLogger.warn(msg);
                continue;
            }
            if (dict[key]) {
                config_1.typeshiLogger.warn([`${source} row @ index ${i} Duplicate key found: '${key}'`,
                    `overwriting value '${dict[key]}' with '${value}'`
                ].join(config_1.INDENT_LOG_LINE));
            }
            dict[key] = value;
        }
        return dict;
    }
    catch (error) {
        config_1.typeshiLogger.error([`${source} An unexpected error occurred, returning empty dictionary.`,
            `caught: ${error}`
        ].join(config_1.NEW_LINE));
        return {};
    }
}
/**
 * @param arg1 `string | FileData | Record<string, any>[]` - the `filePath` to a CSV file or an array of rows.
 * @param columnName `string` - the column name whose values will be returned.
 * @param allowDuplicates `boolean` - `optional` if `true`, allows duplicate values in the returned array, otherwise only unique values are returned.
 * - Defaults to `false`.
 * @returns **`values`** `Promise<Array<string>>` - sorted array of values (as strings) from the specified column.
 */
async function getColumnValues(arg1, columnName, cleaner, allowDuplicates = false) {
    const source = (0, logging_1.getSourceString)(__filename, getColumnValues.name);
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
async function handleFileArgument(arg1, invocationSource, requiredHeaders, sheetName) {
    const source = (0, logging_1.getSourceString)(__filename, handleFileArgument.name);
    try {
        let rows = [];
        if (((0, typeValidation_1.isNonEmptyString)(arg1) && isFile(arg1)) // arg1 is file path
            || (0, types_1.isFileData)(arg1)) {
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
        if ((0, typeValidation_1.isEmpty)(requiredHeaders))
            return rows;
        for (let i = 0; i < rows.length; i++) {
            const rowHeaders = new Set(Object.keys(rows[i]));
            if (requiredHeaders.some(h => !rowHeaders.has(h))) {
                throw new Error([
                    `${source} Invalid row @ index ${i}: Missing required header(s)`,
                    `requiredHeaders: ${JSON.stringify(requiredHeaders)}`,
                    `row${i} headers: ${JSON.stringify(Array.from(rowHeaders))}`,
                    `Source: ${invocationSource}`,
                ].join(config_1.INDENT_LOG_LINE));
            }
        }
        return rows;
    }
    catch (error) {
        config_1.typeshiLogger.error([`${source} An unexpected error occurred. Returning empty array.`,
            `caught: ${error}`
        ].join(config_1.NEW_LINE));
        return [];
    }
}
/**
 * `sync`
 * @param dir `string` path to target directory
 * @param arg2 `boolean (optional)` (`basenameOnly`) `default` = `false`
 * - `if true`,  returned array elements are of form: `path.basename(file)`
 * - `if false`, returned array elements are of form: `path.join(dir, file)`
 * @param targetExtensions `string[] (optional)` - array of file extensions to filter files by.
 * - `if undefined`, all files in the directory will be returned.
 * - `if defined` provided, only files with extensions matching the array will be returned.
 * @returns **`targetFiles`** `string[]` array of file paths
 */
function getDirectoryFiles(dir, arg2, ...targetExtensions) {
    const source = (0, logging_1.getSourceString)(__filename, getDirectoryFiles.name);
    let basenameOnly = false;
    let recursive = false;
    if ((0, typeValidation_1.isBoolean)(arg2)) {
        basenameOnly = arg2;
    }
    else if ((0, typeValidation_1.isNonEmptyString)(arg2)) {
        targetExtensions = [arg2, ...targetExtensions];
    }
    else if ((0, types_1.isDirectoryFileOptions)(arg2)) {
        basenameOnly = arg2.basenameOnly ?? basenameOnly;
        targetExtensions = arg2.targetExtensions ?? [];
        recursive = arg2.recursive ?? false;
    }
    const targetFiles = [];
    try {
        validate.existingDirectoryArgument(source, { dir });
        validate.arrayArgument(source, { targetExtensions, isNonEmptyString: typeValidation_1.isNonEmptyString }, true);
        // ensure all target extensions start with period
        for (let i = 0; i < targetExtensions.length; i++) {
            const ext = targetExtensions[i];
            if (!ext.startsWith('.')) {
                targetExtensions[i] = `.${ext}`;
            }
        }
        const dirContent = fs_1.default.readdirSync(dir);
        targetFiles.push(...dirContent
            .filter(f => (0, typeValidation_1.isNonEmptyArray)(targetExtensions)
            ? (0, regex_1.stringEndsWithAnyOf)(f, targetExtensions, regex_1.RegExpFlagsEnum.IGNORE_CASE)
            : fs_1.default.statSync(node_path_1.default.join(dir, f)).isFile() // get all files in dir, regardless of extension
        ).map(f => basenameOnly ? f : node_path_1.default.join(dir, f)));
        if (recursive) {
            const childDirs = dirContent
                .filter(c => isDirectory(node_path_1.default.join(dir, c)))
                .map(c => node_path_1.default.join(dir, c));
            for (let childDir of childDirs) {
                targetFiles.push(...getDirectoryFiles(childDir, {
                    basenameOnly, recursive, targetExtensions
                }));
            }
        }
        return targetFiles;
    }
    catch (error) {
        config_1.typeshiLogger.error([`${source} Error retrieving directory files, returning empty array`,
            `             dir: '${dir}'`,
            `    basenameOnly: ${basenameOnly}`,
            `targetExtensions: ${JSON.stringify(targetExtensions)}`,
            `    caught error: ${error}`
        ].join(config_1.INDENT_LOG_LINE));
        return [];
    }
}
/**
 * @param dataSource `string | FileData | Record<string, any>[]`
 * @param keyColumn `string`
 * @param valueColumn `string`
 * @param keyOptions {@link StringCleanOptions} `(optional)`
 * @param valueOptions {@link StringCleanOptions} `(optional)`
 * @param sheetName `string` `(optional)`
 * @returns **`dict`** `Promise<Record<string, string[]>>`
 */
async function getOneToManyDictionary(dataSource, keyColumn, valueColumn, keyOptions, valueOptions, sheetName) {
    const source = (0, logging_1.getSourceString)(__filename, getOneToManyDictionary.name);
    try {
        const dict = {};
        validate.multipleStringArguments(source, { keyColumn, valueColumn });
        if (keyOptions)
            validate.objectArgument(source, { keyOptions, isStringCleanOptions: regex_1.isStringCleanOptions });
        if (valueOptions)
            validate.objectArgument(source, { valueOptions, isStringCleanOptions: regex_1.isStringCleanOptions });
        const rows = await handleFileArgument(dataSource, source, [keyColumn, valueColumn], sheetName);
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let key = (0, regex_1.clean)(row[keyColumn], keyOptions)
                .trim().replace(/\.$/, '');
            if (!dict[key])
                dict[key] = [];
            let value = (0, regex_1.clean)(row[valueColumn], valueOptions)
                .trim().replace(/\.$/, '');
            if (!dict[key].includes(value))
                dict[key].push(value);
        }
        return dict;
    }
    catch (error) {
        config_1.typeshiLogger.error([`${source} An unexpected error occurred, returning empty dictionary.`,
            `caught: ${error}`
        ].join(config_1.NEW_LINE));
        return {};
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
    const source = (0, logging_1.getSourceString)(__filename, extractTargetRows.name);
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
