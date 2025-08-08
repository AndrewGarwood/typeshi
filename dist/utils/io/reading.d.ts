import { FileData, ParseOneToManyOptions } from "./types/Io";
import { DelimiterCharacterEnum } from "./types";
export declare function isDirectory(pathString: string): boolean;
export declare function isFile(pathString: string): boolean;
/**
 * Validates CSV structure by properly parsing quoted fields and checking consistency
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
export declare function isValidCsv(filePath: string, requiredHeaders?: string[], options?: {
    allowEmptyRows?: boolean;
    allowInconsistentColumns?: boolean;
    maxRowsToCheck?: number;
}): boolean;
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
 * Determines the proper delimiter based on file type or extension
 * @param filePath `string` Path to the file
 * @returns **`delimiter`** `{`{@link DelimiterCharacterEnum}` | string}` The delimiter character
 * @throws an error if the file extension is unsupported
 */
export declare function getDelimiterFromFilePath(filePath: string): DelimiterCharacterEnum | string;
/**
 * @param filePath `string`
 * @returns **`jsonData`** — `Record<string, any>`
 * - JSON data as an object
 */
export declare function readJsonFileAsObject(filePath: string): Record<string, any>;
/**
 * @param filePath `string`
 * @param expectedExtension `string`
 * @returns **`validatedFilePath`** `string`
 */
export declare function coerceFileExtension(filePath: string, expectedExtension: string): string;
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
export declare function getOneToOneDictionary(arg1: string | Record<string, any>[], keyColumn: string, valueColumn: string): Promise<Record<string, string>>;
/**
 * @TODO add CleanStringOptions param to apply to column values
 * @param arg1 `string | Record<string, any>[]` - the `filePath` to a CSV file or an array of rows.
 * @param columnName `string` - the column name whose values will be returned.
 * @param allowDuplicates `boolean` - `optional` if `true`, allows duplicate values in the returned array, otherwise only unique values are returned.
 * - Defaults to `false`.
 * @returns **`values`** `Promise<Array<string>>` - sorted array of values (as strings) from the specified column.
 */
export declare function getColumnValues(arg1: string | FileData | Record<string, any>[], columnName: string, allowDuplicates?: boolean): Promise<Array<string>>;
/**
 * @param arg1 `string | Record<string, any>[]` - the `filePath` to a CSV file or an array of rows.
 * @param columnName `string` - the column name whose values will be returned.
 * @returns **`indexedColumnValues`** `Promise<Record<string, number[]>>`
 */
export declare function getIndexedColumnValues(arg1: string | FileData | Record<string, any>[], columnName: string): Promise<Record<string, number[]>>;
/**
 * formerly `handleFilePathOrRowsArgument`
 * - {@link getRows}`(filePath: string)`
 * @param arg1 `string | FileData | Record<string, any>[]`
 * @param invocationSource `string`
 * @param requiredHeaders `string[]` `optional`
 * @returns **`rows`** `Promise<Record<string, any>[]>`
 */
export declare function handleFileArgument(arg1: string | FileData | Record<string, any>[], invocationSource: string, requiredHeaders?: string[]): Promise<Record<string, any>[]>;
/**
 * @param dir `string` path to target directory
 * @param targetExtensions `string[] optional` - array of file extensions to filter files by.
 * - `If` not provided, all files in the directory will be returned.
 * - `If` provided, only files with extensions matching the array will be returned.
 * @returns **`targetFiles`** `string[]` array of full file paths
 */
export declare function getDirectoryFiles(dir: string, ...targetExtensions: string[]): string[];
/**
 * @TODO implement overload that uses CleanStringOptions
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
export declare function parseExcelForOneToMany(filePath: string, sheetName: string, keyColumn: string, valueColumn: string, options?: ParseOneToManyOptions): Record<string, Array<string>>;
/**
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
export declare function parseCsvForOneToMany(filePath: string, keyColumn: string, valueColumn: string, delimiter?: DelimiterCharacterEnum | string, options?: ParseOneToManyOptions): Record<string, Array<string>>;
