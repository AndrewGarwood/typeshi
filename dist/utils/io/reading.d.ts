import { StringCaseOptions, StringPadOptions, StringStripOptions, CleanStringOptions } from "../regex";
import { FileData, FileExtension } from "./types/Io";
import { DelimiterCharacterEnum } from "./types";
/** checks if `pathString (value)` points to an existing directory */
export declare function isDirectory(value: any): value is string;
/** checks if `pathString (value)` points to an existing file */
export declare function isFile(value: string): value is string;
/**
 * Determines the proper delimiter based on file type or extension
 * @param filePath `string` Path to the file
 * @returns **`delimiter`** `{`{@link DelimiterCharacterEnum}` | string}` The delimiter character
 * @throws an error if the file extension is unsupported
 */
export declare function getDelimiterFromFilePath(filePath: string): DelimiterCharacterEnum | string;
/**
 * @param filePath `string`
 * @returns **`jsonData`** — `T extends Record<string, any>` - JSON data as an object
 * @note returns empty object if error occurred while reading `filepath` or parsing json
 * - use {@link readJsonSyncOrThrow} if throwing error is desired behavior
 */
export declare const readJsonSync: typeof readJsonFileAsObject;
/**
 * a.k.a. `readJsonSync`
 * @param filePath `string`
 * @returns **`jsonData`** — `T extends Record<string, any>` - JSON data as an object
 * @note returns empty object if error occurred while reading `filepath` or parsing json
 * - use {@link readJsonSyncOrThrow} if throwing error is desired behavior
 */
export declare function readJsonFileAsObject<T extends Record<string, any> = {}>(filePath: string): T;
/**
 * @param filePath `string`
 * @returns **`jsonData`** — `T extends Record<string, any>`
 * @throws {Error} if error occurred while reading `filepath` or parsing json
 */
export declare function readJsonSyncOrThrow<T extends Record<string, any> = {}>(filePath: string): T;
/**
 * @param filePath `string`
 * @param separator `string | RegExp` `default` = `/\r?\n/` (i.e. each line is an individual element in the array)
 * @param encoding {@link BufferEncoding} `default` = `'utf8'`
 * @returns **`arr`** `string[]` - the file content separated by specified param value
 * - returns empty array if error occurs while reading file.
 */
export declare function readFileToArraySync(filePath: string, separator?: string | RegExp, encoding?: BufferEncoding): string[];
/**
 * @description adds `'.${expectedExtension}'` to end of `filePath` if not already present
 * @param filePath `string`
 * @param expectedExtension `string | `{@link FileExtension}
 * @returns **`validatedFilePath`** `string`
 */
export declare function coerceFileExtension(filePath: string, expectedExtension: string | FileExtension): string;
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
export declare function concatenateFiles(arg1: Array<FileData | string> | string, sheetName?: string, requiredHeaders?: string[], strictRequirement?: boolean, targetExtensions?: string[]): Promise<Record<string, any>[]>;
/**
 * @param arg1 {@link FileData}` | string` one of the following:
 * - `fileData:` {@link FileData} = `{ fileName: string; fileContent: string; }`
 * - `filePath:` `string`
 * @param sheetName `string` `optional`
 * - defined/used `if` `arg1` pertains to an excel file and you want to specify which sheet to read
 * - `Default` = `'Sheet1'`
 * @returns **`rows`** `Promise<Record<string, any>[]>`
 */
export declare function getRows(arg1: FileData | string, sheetName?: string): Promise<Record<string, any>[]>;
/**
 * @note excludes empty rows
 * @param arg1
 * @param sheetName
 * @returns
 */
export declare function getExcelRows(arg1: FileData | string, sheetName?: string): Promise<Record<string, any>[]>;
/**
 * @param filePath `string`
 * @returns **`rows`** `Promise<Record<string, any>[]>`
 * - an array of objects representing rows from a CSV file.
 */
export declare function getCsvRows(arg1: FileData | string): Promise<Record<string, any>[]>;
/**
 * @param arg1 `string | Record<string, any>[]` - the file path to a CSV file or an array of rows.
 * @param keyColumn `string` - the column name whose contents will be keys in the dictionary.
 * @param valueColumn `string` - the column name whose contents will be used as values in the dictionary.
 * @returns **`dict`** `Record<string, string>`
 */
export declare function getOneToOneDictionary(arg1: string | Record<string, any>[] | FileData, keyColumn: string, valueColumn: string, keyOptions?: CleanStringOptions, valueOptions?: CleanStringOptions, requireIncludeAllRows?: boolean): Promise<Record<string, string>>;
/**
 * @param arg1 `string | FileData | Record<string, any>[]` - the `filePath` to a CSV file or an array of rows.
 * @param columnName `string` - the column name whose values will be returned.
 * @param allowDuplicates `boolean` - `optional` if `true`, allows duplicate values in the returned array, otherwise only unique values are returned.
 * - Defaults to `false`.
 * @returns **`values`** `Promise<Array<string>>` - sorted array of values (as strings) from the specified column.
 */
export declare function getColumnValues(arg1: string | FileData | Record<string, any>[], columnName: string, cleaner?: (s: string) => string | Promise<string>, allowDuplicates?: boolean): Promise<Array<string>>;
/**
 * @param arg1 `string | FileData | Record<string, any>[]` - the `filePath` to a CSV file or an array of rows.
 * @param columnName `string` - the column name whose values will be returned.
 * @returns **`indexedColumnValues`** `Promise<Record<string, number[]>>`
 */
export declare function getIndexedColumnValues(arg1: string | FileData | Record<string, any>[], columnName: string, cleaner?: (s: string) => string | Promise<string>): Promise<Record<string, number[]>>;
/**
 * @param arg1 `string | FileData | Record<string, any>[]`
 * @param invocationSource `string`
 * @param requiredHeaders `string[]` `optional`
 * @returns **`rows`** `Promise<Record<string, any>[]>`
 */
export declare function handleFileArgument(arg1: string | FileData | Record<string, any>[], invocationSource: string, requiredHeaders?: string[], sheetName?: string): Promise<Record<string, any>[]>;
/**
 * `sync`
 * @param dir `string` path to target directory
 * @param basenameOnly `boolean (optional)` `default` = `false`
 * - `if true`,  returned array elements are of form: `path.basename(file)`
 * - `if false`, returned array elements are of form: `path.join(dir, file)`
 * @param targetExtensions `string[] (optional)` - array of file extensions to filter files by.
 * - `If` not provided, all files in the directory will be returned.
 * - `If` provided, only files with extensions matching the array will be returned.
 * @returns **`targetFiles`** `string[]` array of file paths
 */
export declare function getDirectoryFiles(dir: string, basenameOnly: boolean, ...targetExtensions: string[]): string[];
/**
 * `sync`
 * @param dir `string` path to target directory
 * @param targetExtensions `string[] (optional)` - array of file extensions to filter files by.
 * - `If` not provided, all files in the directory will be returned.
 * - `If` provided, only files with extensions matching the array will be returned.
 * @returns **`targetFiles`** `string[]` array of `full` file paths
 */
export declare function getDirectoryFiles(dir: string, ...targetExtensions: string[]): string[];
/**
 * @param dataSource `string | FileData | Record<string, any>[]`
 * @param keyColumn `string`
 * @param valueColumn `string`
 * @param keyOptions {@link CleanStringOptions} `(optional)`
 * @param valueOptions {@link CleanStringOptions}`(optional)`
 * @param sheetName `string`
 * @returns **`dict`** `Promise<Record<string, string[]>>`
 */
export declare function getOneToManyDictionary(dataSource: string | FileData | Record<string, any>[], keyColumn: string, valueColumn: string, keyOptions?: CleanStringOptions, valueOptions?: CleanStringOptions, sheetName?: string): Promise<Record<string, string[]>>;
/**
 * @deprecated `use `{@link getOneToManyDictionary}
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
export declare function parseExcelForOneToMany(filePath: string, sheetName: string, keyColumn: string, valueColumn: string, options?: {
    keyStripOptions?: StringStripOptions;
    valueStripOptions?: StringStripOptions;
    keyCaseOptions?: StringCaseOptions;
    valueCaseOptions?: StringCaseOptions;
    keyPadOptions?: StringPadOptions;
    valuePadOptions?: StringPadOptions;
}): Record<string, Array<string>>;
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
export declare function parseCsvForOneToMany(filePath: string, keyColumn: string, valueColumn: string, delimiter?: DelimiterCharacterEnum | string, options?: {
    keyStripOptions?: StringStripOptions;
    valueStripOptions?: StringStripOptions;
    keyCaseOptions?: StringCaseOptions;
    valueCaseOptions?: StringCaseOptions;
    keyPadOptions?: StringPadOptions;
    valuePadOptions?: StringPadOptions;
}): Record<string, Array<string>>;
export interface CsvValidationOptions {
    allowEmptyRows?: boolean;
    allowInconsistentColumns?: boolean;
    maxRowsToCheck?: number;
}
/**
 * @notimplemented
 * @TODO
 * @param arg1
 * @param requiredHeaders
 * @param options
 * @returns
 */
export declare function isValidCsv(arg1: string | FileData | Record<string, any>[], requiredHeaders?: string[], options?: CsvValidationOptions): Promise<boolean>;
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
export declare function isValidCsvSync(filePath: string, requiredHeaders?: string[], options?: CsvValidationOptions): boolean;
/**
 * Analyzes a CSV file and returns detailed validation information
 * @param filePath `string` - path to the CSV file
 * @param options `object` - validation options
 * @returns **`analysis`** `object` - detailed analysis of the CSV file
 */
export declare function analyzeCsv(filePath: string, options?: {
    sampleSize?: number;
    checkEncoding?: boolean;
    detectDelimiter?: boolean;
}): {
    isValid: boolean;
    issues: string[];
    warnings: string[];
    stats: {
        totalRows: number;
        headerCount: number;
        maxRowLength: number;
        minRowLength: number;
        emptyRows: number;
        encoding: string | null;
        detectedDelimiter: string | null;
    };
    headers: string[];
};
/**
 * Attempts to repair common CSV formatting issues
 * @param filePath `string` - path to the CSV file to repair
 * @param outputPath `string` - path where the repaired CSV will be saved
 * @param options `object` - repair options
 * @returns **`repairResult`** `object` - result of the repair operation
 */
export declare function repairCsv(filePath: string, outputPath: string, options?: {
    fixQuoting?: boolean;
    removeEmptyRows?: boolean;
    standardizeLineEndings?: boolean;
    fillMissingColumns?: boolean;
    fillValue?: string;
}): {
    success: boolean;
    repairsMade: string[];
    errors: string[];
};
/** paths to folders or files */
export declare function validatePath(...paths: string[]): Promise<void>;
/**
 * @param rowSource `string | Record<string, any>[]`
 * @param targetColumn `string`
 * @param targetValues `string[]`
 * @param extractor `function (columnValue: string, ...args: any[]) => string`
 * @param extractorArgs `any[]`
 * @returns **`targetRows`** `Promise<Record<string, any>[]>`
 * - array of all rows where either `row[targetColumn]` or `extractor(row[targetColumn])` is in `targetValues`
 */
export declare function extractTargetRows(
/**
 * - `string` -> filePath to a csv file
 * - `Record<string, any>[]` -> array of rows
 * */
rowSource: string | Record<string, any>[], targetColumn: string, targetValues: string[], extractor?: (columnValue: string, ...args: any[]) => string | Promise<string>, extractorArgs?: any[]): Promise<{
    rows: Record<string, any>[];
    remainingValues: string[];
}>;
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
export declare function findMissingValues(extantValues: string[], csvFiles: string[] | FileData[] | Record<string, any>[][], column: string, extractor: (columnValue: string, ...args: any[]) => string | Promise<string>, extractorArgs?: any[]): Promise<string[][]>;
