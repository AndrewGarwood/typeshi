/**
 * Auto-formats debug logs at the end of application execution.
 * Call this function when your main application is finishing.
 * @param filePaths `string[]` - optional, specific file paths to format.
 * If not provided, will format all .txt files in the log directory.
 * @returns `void`
 */
export declare function autoFormatLogsOnExit(filePaths?: string[]): void;
/**
 * Formats a debug log file from JSON format to a more readable text format.
 * Removes the numeric keys and properly handles escape sequences.
 * @param inputFilePath `string` - path to the input log file (e.g., DEBUG.txt)
 * @param outputFilePath `string` - optional, path to the output formatted file.
 * If not provided, will use inputFilePath with '.FORMATTED' inserted before the extension.
 * @returns `void`
 */
export declare function formatDebugLogFile(inputFilePath: string, outputFilePath?: string): void;
/**
 * Formats all debug log files in the log directory.
 * Looks for .txt files and creates .FORMATTED.txt versions.
 * @param logDirectory `string` - optional, path to the log directory.
 * If not provided, uses LOCAL_LOG_DIR from setupLog.ts
 * @returns `void`
 */
export declare function formatAllDebugLogs(logDirectory?: string): void;
