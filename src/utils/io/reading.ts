/**
 * @file src/utils/io/reading.ts
 */
import path from "node:path";
import fs from "fs";
import { Readable } from "stream";
import csv from "csv-parser";
import Excel from "xlsx";
import { RegExpFlagsEnum, clean, 
    stringEndsWithAnyOf,
    StringCleanOptions,
    isStringCleanOptions
} from "../regex";
import { DirectoryFileOptions, FileData, FileExtension } from "./types/Io";
import { 
    typeshiLogger as mlog, 
    INDENT_LOG_LINE as TAB, 
    NEW_LINE as NL,
    typeshiSimpleLogger as slog, 
    typeshiHiddenLogger as hlog, 
} from "../../config";
import { DelimiterCharacterEnum, DelimitedFileTypeEnum, isFileData, isDirectoryFileOptions } from "./types";
import { 
    isNonEmptyArray, isEmpty, hasKeys, isNonEmptyString,
    isObject,
    isBoolean
} from "../typeValidation";
import * as validate from "../argumentValidation";
import { getSourceString } from "./logging";

/** checks if `pathString (value)` points to an existing directory */
export function isDirectory(value: any): value is string {
    return (isNonEmptyString(value) 
        && fs.existsSync(value) 
        && fs.statSync(value).isDirectory()
    );
}
/** checks if `pathString (value)` points to an existing file */
export function isFile(value: string): value is string {
    return (isNonEmptyString(value) 
        && fs.existsSync(value) 
        && fs.statSync(value).isFile()
    );
}

/**
 * Determines the proper delimiter based on file type or extension
 * @param filePath `string` Path to the file
 * @returns **`delimiter`** `{`{@link DelimiterCharacterEnum}` | string}` The delimiter character
 * @throws an error if the file extension is unsupported
 */
export function getDelimiterFromFilePath(
    filePath: string
): DelimiterCharacterEnum | string {    
    const extension = filePath.split('.').pop()?.toLowerCase();
    if (extension === DelimitedFileTypeEnum.CSV) {
        return DelimiterCharacterEnum.COMMA;
    } else if (extension === DelimitedFileTypeEnum.TSV) {
        return DelimiterCharacterEnum.TAB;
    } else {
        throw new Error(`[reading.getDelimiterFromFilePath()] Unsupported file extension: ${extension}`);
    }
}

/**
 * @param filePath `string`
 * @returns **`jsonData`** — `T extends Record<string, any>` - JSON data as an object
 * @note returns empty object if error occurred while reading `filepath` or parsing json
 * - use {@link readJsonSyncOrThrow} if throwing error is desired behavior
 */
export const readJsonSync = readJsonFileAsObject;
/**
 * a.k.a. `readJsonSync`
 * @param filePath `string`
 * @returns **`jsonData`** — `T extends Record<string, any>` - JSON data as an object
 * @note returns empty object if error occurred while reading `filepath` or parsing json
 * - use {@link readJsonSyncOrThrow} if throwing error is desired behavior
 */
export function readJsonFileAsObject<T extends Record<string, any> = {}>(filePath: string): T {
    const source = getSourceString(__filename, readJsonFileAsObject.name);
    try {
        filePath = coerceFileExtension(filePath, 'json');
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data) as T;
        return jsonData;
    } catch (error: any) {
        mlog.error([`${source} Error reading JSON file, returning empty object`,
            `Given filePath: '${filePath}'`,
            `caught error: ${error}`,
        ].join(TAB));
        return {} as T;
    }
}

/**
 * @param filePath `string`
 * @returns **`jsonData`** — `T extends Record<string, any>`
 * @throws {Error} if error occurred while reading `filepath` or parsing json
 */
export function readJsonSyncOrThrow<T extends Record<string, any> = {}>(filePath: string): T {
    const source = getSourceString(__filename, readJsonSyncOrThrow.name);
    try {
        filePath = coerceFileExtension(filePath, 'json');
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data) as T;
        return jsonData;
    } catch (error: any) {
        mlog.error([`${source} Error reading JSON file`,
            `Given filePath: '${filePath}'`,
            `caught error: ${error}`,
        ].join(TAB));        
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
export function readFileToArraySync(
    filePath: string, 
    separator: string | RegExp = /\r?\n/, 
    encoding: BufferEncoding = 'utf8'
): string[] {
    const source = getSourceString(__filename, readFileToArraySync.name);
    try {
        const content: string = fs.readFileSync(filePath, { encoding });
        return content.split(separator);
    } catch (error: any) {
        mlog.error([`${source} Error reading file, returning empty array`,
            `Given filePath: '${filePath}'`,
            `caught error: ${error}`,
        ].join(TAB));        
        return [];
    }
}


/**
 * @description adds `'.${expectedExtension}'` to end of `filePath` if not already present
 * @param filePath `string`
 * @param expectedExtension `string | `{@link FileExtension}
 * @returns **`validatedFilePath`** `string` 
 */
export function coerceFileExtension(filePath: string, expectedExtension: string | FileExtension): string {
    validate.multipleStringArguments(getSourceString(__filename, coerceFileExtension.name), 
        {filePath, expectedExtension}
    );
    expectedExtension = expectedExtension.replace(/\./, '');
    if (filePath.endsWith(`.${expectedExtension}`)) {
        return filePath
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
export async function concatenateFiles(
    arg1: Array<FileData | string> | string,
    sheetName: string = 'Sheet1',
    requiredHeaders: string[] = [],
    strictRequirement: boolean = true,
    targetExtensions: string[] = ['.csv', '.tsv', '.xlsx']
): Promise<Record<string, any>[]> {
    const source = getSourceString(__filename, concatenateFiles.name);
    validate.stringArgument(source, {sheetName});
    validate.arrayArgument(source, {targetExtensions, isNonEmptyString});
    let files: Array<FileData | string>;
    if (isNonEmptyArray(arg1)) {
        files = arg1;
    } else if (isDirectory(arg1)) {
        files = getDirectoryFiles(arg1, ...targetExtensions);
    } else if (isFile(arg1) 
        && stringEndsWithAnyOf(arg1, targetExtensions, RegExpFlagsEnum.IGNORE_CASE)) {
        files = [arg1];
    } else {
        let message = [`${source} Invalid parameter: 'arg1'`,
            `Expected: arg1: (Array<FileData | string> | string) to be one of:`,
            `files: FileData[] | filePaths: string[] | filePath: string | dirPath: string`,
            `Received: ${typeof arg1}`
        ].join(TAB);
        mlog.error(message);
        throw new Error(message);
    }
    if (!isNonEmptyArray(files)) { // i.e. isEmptyArray.... shouldn't get here
        mlog.error(`${source} how did this happen, we're smarter than this`)
        return []
    } else if (files.length === 1) {
        return await getRows(files[0], sheetName);
    } // else if files.length > 1, need to make sure each file has same headers
    const concatenatedRows: Record<string, any>[] = [];
    let haveDefinedRequiredHeaders = (isNonEmptyArray(requiredHeaders) 
        && requiredHeaders.every(h => isNonEmptyString(h)) 
            ? true : false
    );
    for (const fileRepresentative of files) {
        const rows = await getRows(fileRepresentative, sheetName);
        if (!isNonEmptyArray(rows)) { continue }
        if (!haveDefinedRequiredHeaders) {
            let firstValidRow = rows.find(row => !isEmpty(row));
            if (!firstValidRow) { continue }
            requiredHeaders = Object.keys(firstValidRow);
            haveDefinedRequiredHeaders = true;
        }
        if (!isNonEmptyArray(requiredHeaders)) {
            mlog.warn(`${source} No requiredHeaders defined,`,
                `skipping file: '${isFileData(fileRepresentative) 
                    ? fileRepresentative.fileName : fileRepresentative
                }'`
            );
            continue;
        }
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!hasKeys(row, requiredHeaders)) {
                let missingHeaders = requiredHeaders.filter(h => !hasKeys(row, h));
                if (strictRequirement) {
                    let message = [`${source} Invalid row: missing required header(s)`,
                        `(strictRequirement === true)`,
                        `           file: '${isFileData(fileRepresentative) 
                            ? fileRepresentative.fileName : fileRepresentative
                        }'`,
                        `       rowIndex: ${i}`,
                        `requiredHeaders: ${JSON.stringify(requiredHeaders)}`,
                        ` missingHeaders: ${JSON.stringify(missingHeaders)}`
                    ].join(TAB);
                    mlog.error(message);
                    throw new Error(message);
                }
                for (const header of missingHeaders) {
                    (row as Record<string, any>)[header] = '';
                }
            }
            concatenatedRows.push(row as Record<string, any>);
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
export async function getRows(
    arg1: FileData | string,
    sheetName: string = 'Sheet1'
): Promise<Record<string, any>[]> {
    if (isFileData(arg1)) {
        const { fileName } = arg1 as FileData;
        if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            return getExcelRows(arg1, sheetName);
        }
        return getCsvRows(arg1);
    } else if (isNonEmptyString(arg1)) { // assume it's a file path
        if (arg1.endsWith('.xlsx') || arg1.endsWith('.xls')) {
            return getExcelRows(arg1, sheetName);
        }
        return getCsvRows(arg1);
    } else {
        throw new Error(
            `[reading.getRows()] Invalid argument: 'arg1' must be a FileData object or a string file path.`
        );
    }
}

/**
 * @note excludes empty rows
 * @param arg1 
 * @param sheetName 
 * @returns 
 */
export async function getExcelRows(
    arg1: FileData | string,
    sheetName: string = 'Sheet1'
): Promise<Record<string, any>[]> {
    const source = '[reading.getExcelRows()]';
    validate.stringArgument(source, {sheetName});
    let filePath: string;
    let fileContent: string | undefined;
    let buffer: Buffer | undefined;
    if (isFileData(arg1) && isNonEmptyString(arg1.fileName) 
        && stringEndsWithAnyOf(arg1.fileName, ['.xlsx', '.xls'])) {
        filePath = arg1.fileName;
        fileContent = arg1.fileContent;
        buffer = Buffer.from(fileContent, 'base64');
    } else if (isNonEmptyString(arg1) && stringEndsWithAnyOf(arg1, ['.xlsx', '.xls'])) {
        filePath = arg1;
        validate.existingPathArgument(`${source}.filePath`, {filePath});
        buffer = fs.readFileSync(filePath);
    } else {
        throw new Error([
            `${source} Invalid argument: 'arg1' (FileData or filePath)`,
            `must be a FileData object or a string file path.`,
            `Received: ${JSON.stringify(arg1)}`
        ].join(TAB));
    }
    try {
        const workbook = Excel.read(buffer, { type: 'buffer' });
        sheetName = (workbook.SheetNames.includes(sheetName) 
            ? sheetName 
            : workbook.SheetNames[0]
        );
        const sheet = workbook.Sheets[sheetName];
        const jsonData: Record<string, any>[] = Excel.utils.sheet_to_json(sheet);
        return jsonData;
    } catch (error) {
        mlog.error([
            `${source} Error reading or parsing the Excel file.`,
            `Received arg1 = ${JSON.stringify(arg1)}, sheetName: '${sheetName}'`,
        ].join(TAB), JSON.stringify(error, null, 4));
        return [];
    }
    
}

/**
 * @param filePath `string`
 * @returns **`rows`** `Promise<Record<string, any>[]>` 
 * - an array of objects representing rows from a CSV file.
 */
export async function getCsvRows(
    arg1: FileData | string
): Promise<Record<string, any>[]> {
    const source = getSourceString(__filename, getCsvRows.name);
    let filePath: string;
    let fileContent: string | undefined;
    let delimiter: DelimiterCharacterEnum | string = DelimiterCharacterEnum.COMMA;
    let buffer: Buffer | undefined;
    if (isFileData(arg1) && isNonEmptyString(arg1.fileName)
        && stringEndsWithAnyOf(arg1.fileName, ['.csv', '.tsv'])) {
        filePath = arg1.fileName;
        fileContent = arg1.fileContent;
        buffer = Buffer.from(fileContent, 'base64');
        delimiter = getDelimiterFromFilePath(filePath);
    } else if (isNonEmptyString(arg1) && stringEndsWithAnyOf(arg1, ['.csv', '.tsv'])) {
        filePath = arg1;
        validate.existingPathArgument(`${source}`, {filePath});
        try {
            buffer = fs.readFileSync(filePath);
        } catch (error) {
            throw new Error([
                `${source} Error making buffer when reading file: '${filePath}'`,
                `Error: ${error instanceof Error ? error.message : String(error)}`
            ].join(TAB));
        }
        delimiter = getDelimiterFromFilePath(filePath);
    } else {
        throw new Error([
            `${source} Invalid argument: 'arg1' (FileData or filePath)`,
            `must be a FileData object or a string file path.`,
            `Received: ${JSON.stringify(arg1)}`
        ].join(TAB));
    }
    const rows: Record<string, any>[] = [];
    if (!buffer) {
        throw new Error(`${source} No buffer available to read`);
    }
    const stream = Readable.from(buffer.toString('utf8'));
    return new Promise((resolve, reject) => {
        stream
            .pipe(csv({ separator: delimiter }))
            .on('data', (row: Record<string, any>) => rows.push(row))
            .on('end', () => {
                hlog.debug([`${source} Successfully read CSV file.`,
                    `filePath: '${filePath}'`,
                    `Number of rows read: ${rows.length}`
                ].join(TAB));
                resolve(rows)
            })
            .on('error', (error) => {
                mlog.error(`${source} Error reading CSV file:`, 
                    TAB+`filePath: '${filePath}'`, 
                    NL+`Error: ${JSON.stringify(error, null, 4)}`
                );
                reject(error);
            });
    })
}

/**
 * @param arg1 `string | Record<string, any>[]` - the file path to a CSV file or an array of rows.
 * @param keyColumn `string` - the column name whose contents will be keys in the dictionary.
 * @param valueColumn `string` - the column name whose contents will be used as values in the dictionary.
 * @returns **`dict`** `Record<string, string>`
 */
export async function getOneToOneDictionary(
    arg1: string | Record<string, any>[] | FileData,
    keyColumn: string,
    valueColumn: string,
    keyOptions?: StringCleanOptions,
    valueOptions?: StringCleanOptions,
    requireIncludeAllRows: boolean = false
): Promise<Record<string, string>> {
    const source = getSourceString(__filename, getOneToOneDictionary.name);
    try {
        validate.multipleStringArguments(source, {keyColumn, valueColumn});
        let rows: Record<string, any>[] = await handleFileArgument(
            arg1, getOneToOneDictionary.name, [keyColumn, valueColumn]
        );
        const dict: Record<string, string> = {};
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            if (!hasKeys(row, [keyColumn, valueColumn])) {
                let msg = [`${source} row @ index ${i} missing key(s): '${keyColumn}', '${valueColumn}'`,
                    `  keyColumn: '${keyColumn}' in row ? ${keyColumn in row} -> row[keyColumn] = '${row[keyColumn]}'`,
                    `valueColumn: '${valueColumn}' in row ? ${valueColumn in row} -> row[valueColumn] = '${row[valueColumn]}'`,
                ].join(TAB);
                if (requireIncludeAllRows) throw new Error(msg);
                mlog.warn(msg);
                continue;
            }
            const key = clean(String(row[keyColumn]), keyOptions) 
            const value = clean(String(row[valueColumn]), valueOptions) 
            if (!key || !value) {
                let msg = [`${source} Row @ index ${i} missing key or value.`, 
                    `  keyColumn: '${keyColumn}' in row ? ${keyColumn in row}`,
                    `->   row[keyColumn] = '${row[keyColumn]}'`,
                    `    clean(String(row[keyColumn]), keyOptions): '${key}'`,
                    `valueColumn: '${valueColumn}' in row ? ${valueColumn in row}`,
                    `-> row[valueColumn] = '${row[valueColumn]}'`,
                    `clean(String(row[valueColumn]), valueOptions): '${value}'`,
                ].join(TAB);
                if (requireIncludeAllRows) throw new Error(msg);
                mlog.warn(msg);
                continue;
            }
            if (dict[key]) {
                mlog.warn([`${source} row @ index ${i} Duplicate key found: '${key}'`,
                    `overwriting value '${dict[key]}' with '${value}'`
                ].join(TAB));
            }
            dict[key] = value;
        }
        return dict;
    } catch (error: any) {
        mlog.error([`${source} An unexpected error occurred, returning empty dictionary.`,
            `caught: ${error}`
        ].join(NL));
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
export async function getColumnValues(
    arg1: string | FileData | Record<string, any>[],
    columnName: string,
    cleaner?: (s: string) => string | Promise<string>,
    allowDuplicates: boolean = false,
): Promise<Array<string>> {
    const source = getSourceString(__filename, getColumnValues.name);
    validate.stringArgument(source, {columnName});
    validate.booleanArgument(source, {allowDuplicates});
    if (cleaner) validate.functionArgument(source, {cleaner})
    let rows: Record<string, any>[] = await handleFileArgument(
        arg1, getColumnValues.name, [columnName]
    );
    const values: Array<string> = [];
    for (const row of rows) {
        if (!isNonEmptyString(String(row[columnName]))) continue;
        const value = (cleaner 
            ? await cleaner(String(row[columnName])) 
            : String(row[columnName])
        ).trim();
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
export async function getIndexedColumnValues(
    arg1: string | FileData | Record<string, any>[],
    columnName: string,
    cleaner?: (s: string) => string | Promise<string>
): Promise<Record<string, number[]>> {
    const source = `[reading.getIndexedColumnValues()]`;
    validate.stringArgument(source, {columnName});
    if (cleaner) validate.functionArgument(source, {cleaner})
    let rows: Record<string, any>[] = await handleFileArgument(
        arg1, getIndexedColumnValues.name, [columnName]
    );
    const valueDict: Record<string, number[]> = {}
    for (const rowIndex in rows) {
        const row = rows[rowIndex];
        if (!isNonEmptyString(String(row[columnName]))) continue;
        const value = (cleaner 
            ? await cleaner(String(row[columnName])) 
            : String(row[columnName])
        ).trim();
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
export async function handleFileArgument(
    arg1: string | FileData | Record<string, any>[],
    invocationSource: string,
    requiredHeaders?: string[],
    sheetName?: string
): Promise<Record<string, any>[]> {
    const source = getSourceString(__filename, handleFileArgument.name);
    try {
        let rows: Record<string, any>[] = [];
        if ((isNonEmptyString(arg1) && isFile(arg1)) // arg1 is file path
            || isFileData(arg1)) { 
            rows = await getRows(arg1, sheetName);
        } else if (isNonEmptyArray(arg1)) { // arg1 is already array of rows
            if (arg1.some(v => !isObject(v))) {
                throw new Error([
                    `${source} Error: Invalid 'arg1' (Record<string, any>[]) param:`,
                    `There exists an element in the row array that is not an object.`,
                    `Source: ${invocationSource}`,
                ].join(TAB))
            }
            rows = arg1 as Record<string, any>[];
        } else {
            throw new Error([
                `${source} Invalid parameter: 'arg1' (string | FileData | Record<string, any>[])`,
                `arg1 must be a file path string, FileData object, or an array of rows.`,
                `Source: ${invocationSource}`,
            ].join(TAB));
        }
        if (isEmpty(requiredHeaders)) return rows;
        for (let i = 0; i < rows.length; i++) {
            const rowHeaders = new Set(Object.keys(rows[i]));
            if (requiredHeaders.some(h=>!rowHeaders.has(h))) {
                throw new Error([
                    `${source} Invalid row @ index ${i}: Missing required header(s)`,
                    `requiredHeaders: ${JSON.stringify(requiredHeaders)}`,
                    `row${i} headers: ${JSON.stringify(Array.from(rowHeaders))}`,
                    `Source: ${invocationSource}`,
                ].join(TAB));
            }
        }
        return rows;
    } catch (error: any) {
        mlog.error([`${source} An unexpected error occurred. Returning empty array.`,
            `caught: ${error}`
        ].join(NL));
        return [];
    }
}


// overloads for backwards compatibility

/**
 * `sync`
 * @param dir `string` path to target directory
 * @param basenameOnly `boolean (optional)` `default` = `false`
 * - `if true`,  returned array elements are of form: `path.basename(file)`
 * - `if false`, returned array elements are of form: `path.join(dir, file)`
 * @param targetExtensions `string[] (optional)` - array of file extensions to filter files by.
 * - `if undefined`, all files in the directory will be returned.
 * - `if defined`, only files with extensions matching the array will be returned.
 * @returns **`targetFiles`** `string[]` array of file paths
 */
export function getDirectoryFiles(
    dir: string,
    basenameOnly: boolean,
    ...targetExtensions: string[]
): string[]

/**
 * `sync`
 * @param dir `string` path to target directory
 * @param targetExtensions `string[] (optional)` - array of file extensions to filter files by.
 * - `if undefined`, all files in the directory will be returned.
 * - `if defined`, only files with extensions matching the array will be returned.
 * @returns **`targetFiles`** `string[]` array of `full` file paths
 */
export function getDirectoryFiles(
    dir: string,
    ...targetExtensions: string[]
): string[]

/**
 * `sync`
 * @param dir `string` path to target directory
 * @param options {@link DirectoryFileOptions} 
 * = `{ basenameOnly?: boolean, recursive?: boolean, targetExtensions?: string[] }`
 * @param options.basenameOnly `boolean (optional)` `default` = `false`
 * - `if true`,  returned array elements are of form: `path.basename(file)`
 * - `if false`, returned array elements are of form: `path.join(dir, file)`
 * @param options.recursive `boolean (optional)` `default` = `false`
 * - `true` - get files from `dir` and all of its subdirectories
 * - `false` - only get files from `dir` (i.e. direct descendants of `dir`)
 * @param options.targetExtensions `string[] (optional)` - array of file extensions to filter files by.
 * - `if undefined`, all files in the directory will be returned.
 * - `if defined`, only files with extensions matching the array will be returned.
 * @returns **`targetFiles`** `string[]` array of file paths
 */
export function getDirectoryFiles(
    dir: string,
    options: DirectoryFileOptions
): string[];

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
export function getDirectoryFiles(
    dir: string,
    arg2?: any,
    ...targetExtensions: string[]
): string[] {
    const source = getSourceString(__filename, getDirectoryFiles.name);
    let basenameOnly = false;
    let recursive = false;
    if (isBoolean(arg2)) {
        basenameOnly = arg2;
    } else if (isNonEmptyString(arg2)) {
        targetExtensions = [arg2, ...targetExtensions];
    } else if (isDirectoryFileOptions(arg2)) {
        basenameOnly = arg2.basenameOnly ?? basenameOnly;
        targetExtensions = arg2.targetExtensions ?? [];
        recursive = arg2.recursive ?? false;
    }
    const targetFiles: string[] = [];
    try {
        validate.existingDirectoryArgument(source, {dir});
        validate.arrayArgument(source, {targetExtensions, isNonEmptyString}, true);
        // ensure all target extensions start with period
        for (let i = 0; i < targetExtensions.length; i++) {
            const ext = targetExtensions[i];
            if (!ext.startsWith('.')) { 
                targetExtensions[i] = `.${ext}`;
            }
        }
        const dirContent = fs.readdirSync(dir);
        targetFiles.push(...dirContent
            .filter(f => isNonEmptyArray(targetExtensions) 
                ? stringEndsWithAnyOf(f, targetExtensions, RegExpFlagsEnum.IGNORE_CASE)
                : fs.statSync(path.join(dir, f)).isFile() // get all files in dir, regardless of extension
            ).map(f => basenameOnly ? f : path.join(dir, f))
        );
        if (recursive) {
            const childDirs = dirContent
                .filter(c=>isDirectory(path.join(dir, c)))
                .map(c=>path.join(dir, c));
            for (let childDir of childDirs) {
                targetFiles.push(...getDirectoryFiles(childDir, { 
                    basenameOnly, recursive, targetExtensions 
                }));
            }
        }
        return targetFiles;
    } catch (error: any) {
        mlog.error([`${source} Error retrieving directory files, returning empty array`,
            `             dir: '${dir}'`,
            `    basenameOnly: ${basenameOnly}`,
            `targetExtensions: ${JSON.stringify(targetExtensions)}`,
            `    caught error: ${error}`
        ].join(TAB));
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
export async function getOneToManyDictionary(
    dataSource: string | FileData | Record<string, any>[],
    keyColumn: string,
    valueColumn: string,
    keyOptions?: StringCleanOptions,
    valueOptions?: StringCleanOptions,
    sheetName?: string
): Promise<Record<string, string[]>> {
    const source = getSourceString(__filename, getOneToManyDictionary.name);
    try {
        const dict: Record<string, string[]> = {}
        validate.multipleStringArguments(source, {keyColumn, valueColumn});
        if (keyOptions) validate.objectArgument(source, {keyOptions, isStringCleanOptions});
        if (valueOptions) validate.objectArgument(source, {valueOptions, isStringCleanOptions});
        const rows = await handleFileArgument(dataSource, source, [keyColumn, valueColumn], sheetName);
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let key = clean(row[keyColumn], keyOptions)
                .trim().replace(/\.$/, '');
            if (!dict[key]) dict[key] = [];
            let value = clean(row[valueColumn], valueOptions)
                .trim().replace(/\.$/, '');
            if (!dict[key].includes(value)) dict[key].push(value);
        }
        return dict;
    } catch (error: any) {
        mlog.error([`${source} An unexpected error occurred, returning empty dictionary.`,
            `caught: ${error}`
        ].join(NL));
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
export async function extractTargetRows(
    /** 
     * - `string` -> filePath to a csv file
     * - `Record<string, any>[]` -> array of rows
     * */
    rowSource: string | Record<string, any>[],
    targetColumn: string, 
    targetValues: string[],
    extractor?: (columnValue: string, ...args: any[]) => string | Promise<string>, 
    extractorArgs?: any[]
): Promise<{
    rows: Record<string, any>[];
    remainingValues: string[]
}> {
    const source = getSourceString(__filename, extractTargetRows.name);
    if(!isNonEmptyString(rowSource) && !isNonEmptyArray(rowSource)) {
        throw new Error([`${source} Invalid param 'rowSource'`,
            `Expected rowSource: string | Record<string, any>[]`,
            `Received rowSource: '${typeof rowSource}'`
        ].join(TAB));
    }
    validate.stringArgument(source, {targetColumn});
    if (extractor !== undefined) validate.functionArgument(source, {extractor});
    validate.arrayArgument(source, {targetValues, isNonEmptyString});
    const sourceRows = await handleFileArgument(
        rowSource, extractTargetRows.name, [targetColumn]
    );
    const remainingValues: string[] = [];
    let potentials: Record<string, number[]> = {};
    let valuesFound: string[] = [];
    const targetRows: Record<string, any>[] = [];
    for (let i = 0; i < sourceRows.length; i++) {
        const row = sourceRows[i];
        if (!hasKeys(row, targetColumn)) {
            mlog.warn([`${source} row does not have provided targetColumn`,
                `    targetColumn: '${targetColumn}'`,
                `Object.keys(row):  ${JSON.stringify(Object.keys(row))}`,
            ].join(TAB));
            continue;
        }
        const originalValue = String(row[targetColumn]);
        if (targetValues.includes(originalValue)) {
            targetRows.push(row);
            if (!valuesFound.includes(originalValue)) valuesFound.push(originalValue);
            // slog.debug(`${source} ORIGINAL VALUE IN TARGET VALUES`)
            continue;
        }
        if (!extractor) { continue }
        const extractedValue = await extractor(originalValue, extractorArgs);
        if (!isNonEmptyString(extractedValue)) {
            // slog.warn([`${source} extractor(value) returned invalid string`,
            //     ` originalValue: '${originalValue}'`, 
            //     `rowSource type: '${typeof rowSource}'`
            // ].join(TAB));
            continue;
        }
        if (targetValues.includes(extractedValue)) {
            targetRows.push(row);
            if (!valuesFound.includes(extractedValue)) valuesFound.push(extractedValue);
            continue;
        }
        let targetMatch = targetValues.find(v=>{
            v = v.toUpperCase();
            return v.startsWith(extractedValue.toUpperCase())
        });
        if (targetMatch) {
            if (!potentials[targetMatch]) {
                potentials[targetMatch] = [i]
            } else {
                potentials[targetMatch].push(i)
            }
            // slog.debug([`${source} Found potentialMatch for a targetValue at rowIndex ${i}`,
            //     ` originalValue: '${originalValue}'`, 
            //     `extractedValue: '${extractedValue}'`, 
            //     `potentialMatch: '${targetMatch}'`, 
            // ].join(TAB));
        }
    }
    remainingValues.push(...targetValues.filter(v=> !valuesFound.includes(v)));
    // if (remainingValues.length > 0) {
    //     mlog.warn([`${source} ${remainingValues.length} value(s) from targetValues did not have a matching row`,
    //         // indentedStringify(remainingValues)
    //     ].join(TAB));
    //     write({remainingValues}, path.join(CLOUD_LOG_DIR, `${getFileNameTimestamp()}_remainingValues.json`))
    // }
    return {rows: targetRows, remainingValues};
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
export async function findMissingValues(
    extantValues: string[],
    csvFiles: string[] | FileData[] | Record<string, any>[][],
    column: string, 
    extractor: (columnValue: string, ...args: any[]) => string | Promise<string>,
    extractorArgs: any[] = []
): Promise<string[][]> {
    const source = getSourceString(__filename, findMissingValues.name);
    const missingValues: string[][] = [];
    for (let i = 0; i < csvFiles.length; i++) {
        const rowSource = csvFiles[i];
        missingValues[i] = [];
        const columnValues = await getColumnValues(rowSource, column);
        for (const originalValue of columnValues) {
            const extractedValue = await extractor(originalValue, ...extractorArgs);
            if (!isNonEmptyString(extractedValue)) {
                slog.warn([`${source} extractor(value) returned invalid string`,
                    `originalValue: '${originalValue}'`, 
                ].join(TAB));
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