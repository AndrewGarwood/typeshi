import { ILogObj, ILogObjMeta } from "tslog";
/**
 * @param fileName `string` passed into `extractFileName()`
 * @param func `Function` - to get Function.name
 * @param funcInfo `any` `(optional)` - context or params of func (converted to string)
 * @param startLine `number` `(optional)`
 * @param endLine `number` `(optional)`
 * @returns **`sourceString`** `string` to use in log statements or argumentValidation calls
 */
export declare function getSourceString(fileName: string, func: string | Function, funcInfo?: any, startLine?: number, endLine?: number): string;
/**
 * @deprecated
 * Auto-formats debug logs at the end of application execution.
 * Call this function when your main application is finishing.
 * @param filePaths `string[]` - optional, specific file paths to format.
 * If not provided, will format all .txt files in the log directory.
 * @returns `void`
 */
export declare function autoFormatLogsOnExit(filePaths?: string[]): void;
/**
 * @deprecated
 * Formats a debug log file from JSON format to a more readable text format.
 * Removes the numeric keys and properly handles escape sequences.
 * @param inputPath `string` - path to the input log file (e.g., DEBUG.txt)
 * @param outputPath `string` - optional, path to the output formatted file.
 * If not provided, will use inputPath with '.FORMATTED' inserted before the extension.
 * @returns `void`
 */
export declare function formatDebugLogFile(inputPath: string, outputPath?: string): void;
/**
 * @deprecated
 * Formats all debug log files in the log directory.
 * Looks for .txt files and creates .FORMATTED.txt versions.
 * @param logDirectory `string` - optional, path to the log directory.
 * If not provided, uses LOCAL_LOG_DIR from setupLog.ts
 * @returns `void`
 */
export declare function formatAllDebugLogs(logDirectory: string): void;
/**
 * @deprecated
 * reduce metadata to two entries, then return stringified `logObj`
 * @param logObj {@link ILogObj}
 * @returns `string`
 */
export declare function formatLogObj(logObj: ILogObj | (ILogObj & ILogObjMeta)): string;
