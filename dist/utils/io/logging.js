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
exports.getSourceString = getSourceString;
exports.autoFormatLogsOnExit = autoFormatLogsOnExit;
exports.formatDebugLogFile = formatDebugLogFile;
exports.formatAllDebugLogs = formatAllDebugLogs;
/**
 * @file src/utils/io/logging.ts
 */
const fs = __importStar(require("fs"));
const setupLog_1 = require("../../config/setupLog");
const typeValidation_1 = require("../typeValidation");
const regex_1 = require("../regex");
const validate = __importStar(require("../argumentValidation"));
const node_path_1 = __importDefault(require("node:path"));
const F = (0, regex_1.extractFileName)(__filename);
/**
 * @param fileName `string`
 * @param func `Function` - to get Function.name
 * @param funcInfo `any` `(optional)` - context or params of func (converted to string)
 * @param startLine `number` `(optional)`
 * @param endLine `number` `(optional)`
 * @returns **`sourceString`** `string` to use in log statements or argumentValidation calls
 */
function getSourceString(fileName, func, funcInfo, startLine, endLine) {
    let lineNumberText = ((0, typeValidation_1.isInteger)(startLine)
        ? `:${startLine}`
        : '');
    lineNumberText = ((0, typeValidation_1.isNonEmptyString)(lineNumberText)
        && (0, typeValidation_1.isInteger)(endLine)
        ? lineNumberText + `-${endLine}`
        : '');
    let funcName = typeof func === 'string' ? func : func.name;
    return `[${fileName}.${funcName}(${(0, typeValidation_1.isNonEmptyString)(funcInfo) ? ` ${funcInfo} ` : ''})${lineNumberText}]`;
}
/**
 * Auto-formats debug logs at the end of application execution.
 * Call this function when your main application is finishing.
 * @param filePaths `string[]` - optional, specific file paths to format.
 * If not provided, will format all .txt files in the log directory.
 * @returns `void`
 */
function autoFormatLogsOnExit(filePaths) {
    const source = `[${F}.${autoFormatLogsOnExit.name}()]`;
    if (!(0, typeValidation_1.isStringArray)(filePaths)) {
        setupLog_1.typeshiLogger.warn([`${source} Invalid param 'filePaths'`,
            `Expected: string[] (array of filePaths)`,
            `Received: ${typeof filePaths} = '${JSON.stringify(filePaths)}'`
        ].join(setupLog_1.INDENT_LOG_LINE));
        return;
    }
    try {
        for (const filePath of filePaths) {
            if (fs.existsSync(filePath)) {
                formatDebugLogFile(filePath);
            }
        }
    }
    catch (error) {
        // Don't throw errors during exit formatting to avoid disrupting the main flow
        setupLog_1.typeshiLogger.error(`${source} Error formatting logs: `, error);
    }
}
/**
 * Formats a debug log file from JSON format to a more readable text format.
 * Removes the numeric keys and properly handles escape sequences.
 * @param inputFilePath `string` - path to the input log file (e.g., DEBUG.txt)
 * @param outputFilePath `string` - optional, path to the output formatted file.
 * If not provided, will use inputFilePath with '.FORMATTED' inserted before the extension.
 * @returns `void`
 */
function formatDebugLogFile(inputFilePath, outputFilePath) {
    validate.existingPathArgument(`logging.formatDebugLogFile`, { inputFilePath });
    // Generate output path if not provided
    if (!outputFilePath) {
        const parsedPath = node_path_1.default.parse(inputFilePath);
        outputFilePath = node_path_1.default.join(parsedPath.dir, `${parsedPath.name}.FORMATTED${parsedPath.ext}`);
    }
    try {
        const fileContent = fs.readFileSync(inputFilePath, 'utf-8');
        const formattedContent = formatLogContent(fileContent);
        fs.writeFileSync(outputFilePath, formattedContent, { encoding: 'utf-8' });
        // mlog.info(`[formatDebugLogFile()] Formatted log file saved to '${outputFilePath}'`);
    }
    catch (error) {
        setupLog_1.typeshiLogger.error('[formatDebugLogFile()] Error formatting log file:', error);
        throw error;
    }
}
/**
 * Formats the content of a debug log file from JSON objects to readable text.
 * @param content `string` - the raw content of the log file
 * @returns `string` - the formatted content
 */
function formatLogContent(content) {
    const lines = content.split('\n');
    const formattedLines = [];
    let currentJsonObject = '';
    let insideJsonObject = false;
    let braceCount = 0;
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === '{') {
            insideJsonObject = true;
            braceCount = 1;
            currentJsonObject = line;
        }
        else if (insideJsonObject) {
            currentJsonObject += '\n' + line;
            // Count braces to detect end of JSON object
            for (const char of line) {
                if (char === '{')
                    braceCount++;
                if (char === '}')
                    braceCount--;
            }
            if (braceCount === 0) {
                // End of JSON object, process it
                try {
                    const logObj = JSON.parse(currentJsonObject);
                    const formattedLogEntry = formatSingleLogEntry(logObj);
                    if (formattedLogEntry.trim()) {
                        formattedLines.push(formattedLogEntry);
                        formattedLines.push(''); // Add blank line between entries
                    }
                }
                catch (error) {
                    // If JSON parsing fails, include the original content
                    formattedLines.push('[formatLogContent(string)] Failed to parse JSON object:', currentJsonObject, '');
                }
                insideJsonObject = false;
                currentJsonObject = '';
            }
        }
        else if (trimmedLine === '') { // Skip empty lines when not inside JSON object
            continue;
        }
        else { // Any other content (shouldn't happen with your format, but just in case)
            formattedLines.push(line);
        }
    }
    return formattedLines.join('\n');
}
/**
 * Formats a single log entry object into readable text.
 * @param logObj `Record<string, any>` - the parsed log object
 * @returns `string` - the formatted log entry
 */
function formatSingleLogEntry(logObj) {
    const lines = [];
    // Extract metadata (keys like '-1', '-2', 'meta0', etc.)
    const metaKeys = Object.keys(logObj).filter(key => key.startsWith('-') || key.startsWith('meta') || key.includes('meta'));
    const contentKeys = Object.keys(logObj).filter(key => !key.startsWith('-') && !key.startsWith('meta') && /^\d+$/.test(key)).sort((a, b) => parseInt(a) - parseInt(b)); // Sort numeric keys
    // Add metadata line
    if (metaKeys.length > 0) {
        let metaValue = metaKeys.map(key => logObj[key]).join(' ');
        // const metaValue = logObj[metaKeys[0]]; // Use first meta key found
        if (metaValue) {
            lines.push(unescapeString(metaValue) + '\n');
        }
    }
    // Add content lines (without the numeric keys)
    for (const key of contentKeys) {
        const value = logObj[key];
        if ((0, typeValidation_1.isNonEmptyString)(value)) {
            const unescapedValue = unescapeString(value);
            if (unescapedValue.trim()) {
                lines.push(unescapedValue);
            }
        }
    }
    return lines.join(''); // lines.join('\n');
}
/**
 * Unescapes a string by replacing escape sequences with their actual characters.
 * @param s `string` - the string with escape sequences
 * @returns `string` - the unescaped string
 */
function unescapeString(s) {
    return String(s) // coerce passed value to string
        .replace(/\\n/g, '\n') // Replace \n with actual newlines
        .replace(/\\t/g, '\t') // Replace \t with actual tabs
        .replace(/\\r/g, '\r') // Replace \r with carriage returns
        .replace(/\\"/g, '"') // Replace \" with actual quotes
        .replace(/\\\\/g, '\\') // Replace \\ with single backslash
        .replace(/\\'/g, "'"); // Replace \' with actual single quotes
}
/**
 * Formats all debug log files in the log directory.
 * Looks for .txt files and creates .FORMATTED.txt versions.
 * @param logDirectory `string` - optional, path to the log directory.
 * If not provided, uses LOCAL_LOG_DIR from setupLog.ts
 * @returns `void`
 */
function formatAllDebugLogs(logDirectory) {
    let logDir = logDirectory;
    if (!fs.existsSync(logDir)) {
        setupLog_1.typeshiLogger.warn(`[formatAllDebugLogs()] Log directory does not exist: ${logDir}`);
        return;
    }
    try {
        const files = fs.readdirSync(logDir);
        const txtFiles = files.filter(file => file.endsWith('.txt') && !file.includes('.FORMATTED.'));
        if (txtFiles.length === 0) {
            setupLog_1.typeshiLogger.warn(`[formatAllDebugLogs()] No .txt log files found in ${logDir}`);
            return;
        }
        for (const txtFile of txtFiles) {
            const inputPath = node_path_1.default.join(logDir, txtFile);
            try {
                formatDebugLogFile(inputPath);
                // mlog.info(`[formatAllDebugLogs()] Formatted: ${txtFile}`);
            }
            catch (error) {
                setupLog_1.typeshiLogger.error(`[formatAllDebugLogs()] Failed to format ${txtFile}:`, error);
            }
        }
    }
    catch (error) {
        setupLog_1.typeshiLogger.error('[formatAllDebugLogs()] Error reading log directory:', error);
        throw error;
    }
}
