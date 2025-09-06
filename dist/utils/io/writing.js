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
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJsonSync = void 0;
exports.writeObjectToJsonSync = writeObjectToJsonSync;
exports.indentedStringify = indentedStringify;
exports.getFileNameTimestamp = getFileNameTimestamp;
exports.writeListsToCsvSync = writeListsToCsvSync;
exports.trimFileSync = trimFileSync;
exports.trimFile = trimFile;
exports.clearFileSync = clearFileSync;
exports.clearFile = clearFile;
exports.writeRowsToCsvSync = writeRowsToCsvSync;
/**
 * @file src/utils/io/writing.ts
 */
const fs = __importStar(require("fs"));
const env_1 = require("../../config/env");
const setupLog_1 = require("../../config/setupLog");
const reading_1 = require("./reading");
const types_1 = require("./types");
const typeValidation_1 = require("../typeValidation");
const validate = __importStar(require("../argumentValidation"));
const fs_1 = require("fs");
const logging_1 = require("./logging");
function writeObjectToJsonSync(
/** {@link WriteJsonOptions} `| Record<string, any> | string`, */
arg1, filePath, indent = 4, enableOverwrite = true) {
    const source = (0, logging_1.getSourceString)(__filename, writeObjectToJsonSync.name);
    if (!arg1) {
        setupLog_1.typeshiLogger.error(`${source} No data to write to JSON file'`);
        return;
    }
    let data;
    let outputFilePath;
    let outputIndent = indent;
    let outputEnableOverwrite = enableOverwrite;
    if ((0, types_1.isWriteJsonOptions)(arg1)) {
        data = arg1.data;
        outputFilePath = arg1.filePath;
        outputIndent = arg1.indent ?? indent;
        outputEnableOverwrite = arg1.enableOverwrite ?? enableOverwrite;
    }
    else {
        if (!(0, typeValidation_1.isNonEmptyString)(filePath)) {
            setupLog_1.typeshiLogger.error(`${source} filePath is required when not using WriteJsonOptions object'`);
            return;
        }
        data = arg1;
        outputFilePath = filePath;
    }
    let objectData;
    if ((0, typeValidation_1.isNonEmptyString)(data)) {
        try {
            objectData = JSON.parse(data);
        }
        catch (error) {
            setupLog_1.typeshiLogger.error(`${source} Error parsing string to JSON'`, error);
            return;
        }
    }
    else if ((0, typeValidation_1.isObject)(data)) {
        objectData = data;
    }
    else {
        setupLog_1.typeshiLogger.error(`${source} Invalid parameter 'data'`);
        return;
    }
    const outputPath = (0, reading_1.coerceFileExtension)(outputFilePath, 'json');
    try {
        const jsonData = JSON.stringify(objectData, null, outputIndent);
        if (outputEnableOverwrite) {
            fs.writeFileSync(outputPath, jsonData, { flag: 'w' });
        }
        else {
            fs.appendFileSync(outputPath, jsonData, { flag: 'a' });
        }
        // mlog.info(`[writing.writeObjectToJson()] file saved to '${outputPath}'`)
    }
    catch (error) {
        setupLog_1.typeshiLogger.error(`${source} Error writing to JSON file'`, error);
        throw error;
    }
}
exports.writeJsonSync = writeObjectToJsonSync;
/**
 * @param data `Record<string, any> | string` - JSON data to stringify
 * @param indent `number` `optional`, default=`0` - number of additional indents to add to each line
 * @param spaces `number` `optional`, default=`4`
 * @returns **`jsonString`** `string`
 */
function indentedStringify(data, indent = 0, spaces = 4) {
    if (!data) {
        return '';
    }
    let jsonString = typeof data === 'string'
        ? data : JSON.stringify(data, null, spaces);
    jsonString = jsonString
        .split('\n')
        .map(line => setupLog_1.INDENT_LOG_LINE + '\t'.repeat(indent) + line)
        .join('')
        .replace(/^\n\t. /, '').replace(/•/g, '');
    return jsonString;
}
/**
 * @returns **`timestamp`** `string` = `(${MM}-${DD})-(${HH}-${mm}.${ss}.${ms})`
 */
function getFileNameTimestamp() {
    const now = new Date();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    return `(${MM}-${DD})-(${HH}-${mm}.${ss}.${ms})`;
}
/**
 * @param listData `Record<string, Array<string>>` map col names to col values
 * @param outputPath `string`
 * @param delimiter `string` - optional, default=`'\t'`
 * @param columnDelimiter `string` - optional, default=`''`
 */
function writeListsToCsvSync(listData, outputPath, delimiter = types_1.DelimiterCharacterEnum.TAB, columnDelimiter = '') {
    const listNames = Object.keys(listData);
    const listValues = Object.values(listData);
    // Get the maximum length of the lists
    const maxLength = Math.max(...listValues.map(list => list.length));
    let csvContent = listNames.join(delimiter) + '\n';
    if ((0, typeValidation_1.isNonEmptyString)(columnDelimiter)) {
        delimiter = delimiter + columnDelimiter + delimiter;
    }
    for (let i = 0; i < maxLength; i++) {
        const row = listValues.map(list => list[i] || '').join(delimiter);
        csvContent += row + '\n';
    }
    fs.writeFile(outputPath, csvContent, (err) => {
        if (err) {
            setupLog_1.typeshiLogger.error('Error writing to CSV file', err);
            return;
        }
        setupLog_1.typeshiLogger.info(`CSV file has been saved to ${outputPath}`);
    });
}
/**
 * @TODO handle other file extensions
 * @param maxMB - Maximum size in MB to keep in the file, default is `5` -> 5MB.
 * @param filePaths arbitrary number of text file paths to trim
 */
function trimFileSync(maxMB = 5, ...filePaths) {
    if ((0, typeValidation_1.isEmptyArray)(filePaths))
        return;
    const MAX_BYTES = maxMB * 1024 * 1024;
    for (const filePath of filePaths) {
        if (!filePath || !fs.existsSync(filePath)
            || !filePath.toLowerCase().endsWith('.txt')) {
            setupLog_1.typeshiLogger.error(`File does not exist or is not text: ${filePath}`);
            continue;
        }
        try {
            const stats = fs.statSync(filePath);
            if (stats.size <= MAX_BYTES)
                return;
            const fd = fs.openSync(filePath, 'r+');
            const buffer = Buffer.alloc(MAX_BYTES);
            fs.readSync(fd, buffer, 0, MAX_BYTES, stats.size - MAX_BYTES);
            fs.ftruncateSync(fd, 0);
            fs.writeSync(fd, buffer, 0, MAX_BYTES, 0);
            fs.closeSync(fd);
            setupLog_1.typeshiLogger.info(`Trimmed file to last ${maxMB}MB: ${filePath}`);
        }
        catch (e) {
            setupLog_1.typeshiLogger.error('Error trimming file to last 10MB', e);
            throw e;
        }
    }
}
async function trimFile(maxMB = 5, ...filePaths) {
    if ((0, typeValidation_1.isEmptyArray)(filePaths))
        return;
    const MAX_BYTES = maxMB * 1024 * 1024;
    for (const filePath of filePaths) {
        if (!filePath || !fs.existsSync(filePath)
            || !filePath.toLowerCase().endsWith('.txt')) {
            setupLog_1.typeshiLogger.error(`File does not exist or is not text: ${filePath}`);
            continue;
        }
        try {
            const stats = fs.statSync(filePath);
            if (stats.size <= MAX_BYTES)
                return;
            const fd = fs.openSync(filePath, 'r+');
            const buffer = Buffer.alloc(MAX_BYTES);
            fs.readSync(fd, buffer, 0, MAX_BYTES, stats.size - MAX_BYTES);
            fs.ftruncateSync(fd, 0);
            fs.writeSync(fd, buffer, 0, MAX_BYTES, 0);
            fs.closeSync(fd);
            setupLog_1.typeshiLogger.info(`Trimmed file to last ${maxMB}MB: ${filePath}`);
        }
        catch (e) {
            setupLog_1.typeshiLogger.error('Error trimming file to last 10MB', e);
            throw e;
        }
    }
    await (0, env_1.DELAY)(1000, `[trimFile()] Releasing file handles...`);
}
/**
 * `sync` Clears the content of the specified log file(s).
 * @param filePaths - The path(s) to the log file(s) to clear.
 */
function clearFileSync(...filePaths) {
    for (const filePath of filePaths) {
        if (!filePath || !(0, fs_1.existsSync)(filePath)) {
            setupLog_1.typeshiLogger.warn(`clearFileSync() Log file does not exist: ${filePath}`);
            continue;
        }
        try {
            (0, fs_1.writeFileSync)(filePath, '', { encoding: 'utf-8', flag: 'w' });
        }
        catch (error) {
            if (error.code === 'EBUSY' || error.code === 'EMFILE') {
                // File is busy, try again after a short delay
                setTimeout(() => {
                    try {
                        (0, fs_1.writeFileSync)(filePath, '', { encoding: 'utf-8', flag: 'w' });
                    }
                    catch (retryError) {
                        setupLog_1.typeshiLogger.warn(`clearFileSync() Failed to clear file after retry: ${filePath}`, retryError);
                    }
                }, 50);
            }
            else {
                setupLog_1.typeshiLogger.warn(`clearFileSync() Failed to clear file: ${filePath}`, error);
            }
        }
    }
}
/**
 * `async` func to ensure files are cleared before proceeding.
 * @param filePaths - The path(s) to the log file(s) to clear.
 */
async function clearFile(...filePaths) {
    const promises = filePaths.map(async (filePath) => {
        if (!filePath || !(0, fs_1.existsSync)(filePath)) {
            setupLog_1.typeshiLogger.warn(`clearFile() Log file does not exist: ${filePath}`);
            return;
        }
        return new Promise((resolve, reject) => {
            const tryWrite = (attempt = 1) => {
                try {
                    (0, fs_1.writeFileSync)(filePath, '', { encoding: 'utf-8', flag: 'w' });
                    resolve();
                }
                catch (error) {
                    if ((error.code === 'EBUSY' || error.code === 'EMFILE') && attempt < 3) {
                        setTimeout(() => tryWrite(attempt + 1), 50 * attempt);
                    }
                    else {
                        setupLog_1.typeshiLogger.warn(`clearFile() Failed to clear file: ${filePath}`, error);
                        resolve(); // Don't reject, just warn and continue
                    }
                }
            };
            tryWrite();
        });
    });
    await Promise.all(promises);
    await (0, env_1.DELAY)(1000, ` > [clearFile()] Releasing file handles...`);
}
/**
 * @consideration maybe it would be better to have the delimiter be an explicit param rather
 * than implicitly determined by `outputPath`
 * - can write to `tsv` by having `outputPath` end with `'.tsv'`
 * @param rows `Record<string, any>[]` - array of objects to write to CSV
 * @param outputPath `string` - path to the output CSV file.
 * @returns **`void`**
 */
function writeRowsToCsvSync(rows, outputPath) {
    const source = `[writing.writeRowsToCsv()]`;
    validate.arrayArgument(source, { rows });
    validate.stringArgument(source, { outputPath });
    const delimiter = (0, reading_1.getDelimiterFromFilePath)(outputPath);
    const headers = Object.keys(rows[0] || {});
    if ((0, typeValidation_1.isEmptyArray)(headers)) {
        setupLog_1.typeshiLogger.error(`${source} No headers found in rows, nothing to write.`, setupLog_1.INDENT_LOG_LINE + `Intended outputPath: '${outputPath}'`);
        return;
    }
    if (rows.some(row => !(0, typeValidation_1.hasKeys)(row, headers))) {
        setupLog_1.typeshiLogger.error([`${source} Some rows do not have all headers!`,
            `headers: ${JSON.stringify(headers)}`,
            `Intended outputPath: '${outputPath}'`
        ].join(setupLog_1.INDENT_LOG_LINE));
        return;
    }
    const csvContent = [headers.join(delimiter)].concat(rows.map(row => headers.map(header => row[header] || '').join(delimiter))).join('\n');
    try {
        fs.writeFileSync(outputPath, csvContent, { encoding: 'utf-8' });
        setupLog_1.typeshiLogger.info(`${source} file has been saved to '${outputPath}'`);
    }
    catch (e) {
        setupLog_1.typeshiLogger.error('[writeRowsToCsv()] Error writing to CSV file', e);
        throw e;
    }
}
