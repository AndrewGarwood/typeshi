/**
 * @file src/utils/io/writing.ts
 */
import * as fs from "node:fs";
import { WriteJsonOptions } from "./types";
/**
 * Output JSON data to a file with `fs.writeFileSync` or `fs.appendFileSync`.
 * @param options {@link WriteJsonOptions}
 * @param options.data `Record<string, any> | string` - JSON data to write to file.
 * - If `data` is a string, it will be parsed to JSON. If `data` is an object, it will be converted to JSON.
 * @param options.filePath `string` - the complete path or the path to the directory where the file will be saved. If `fileName` is not provided, it will be assumed the `filePath` contains the name and extension.
 * @param options.indent `number` - `optional`, default=`4`
 * @param options.enableOverwrite `boolean` - `optional`, default=`true` If `enableOverwrite` is `true`, the file will be overwritten. If `false`, the `data` will be appended to the file.
 * @returns {void}
 */
export declare function writeObjectToJsonSync(options: WriteJsonOptions): void;
/**
 * Output JSON data to a file with `fs.writeFileSync` or `fs.appendFileSync`.
 * @param data `Record<string, any> | string` - JSON data to write to file
 * - If `data` is a string, it will be parsed to JSON. If `data` is an object, it will be converted to JSON.
 * @param filePath `string` - the complete path or the path to the directory where the file will be saved. If `fileName` is not provided, it will be assumed the `filePath` contains the name and extension.
 * @param indent `number` - `optional`, default=`4`
 * @param enableOverwrite `boolean` - `optional`, default=`true` If `enableOverwrite` is `true`, the file will be overwritten. If `false`, the `data` will be appended to the file.
 * @returns {void}
 */
export declare function writeObjectToJsonSync(data: Record<string, any> | string, filePath: string, indent?: number, enableOverwrite?: boolean): void;
export declare const writeJsonSync: typeof writeObjectToJsonSync;
export declare const writeArraysToCsvSync: typeof writeListsToCsvSync;
/**
 * @param listData `Record<string, Array<string>>` map col names to col values
 * @param outputPath `string`
 * @param delimiter `string` - optional, default=`'\t'`
 * @param columnDelimiter `string` - optional, default=`''`
 */
export declare function writeListsToCsvSync(listData: Record<string, Array<string>>, outputPath: string, delimiter?: string, columnDelimiter?: string): void;
/**
 * @param arr `T[]`
 * @param outputPath `string`
 * @param separator `string` `default` = `'\n'`
 * @param options {@link fs.WriteFileOptions} `default` = `{ encoding: 'utf-8', flag: 'w' }`
 * - use `flag: 'a'` to append rather than overwrite
 */
export declare function writeArrayToFileSync<T>(arr: T[], outputPath: string, separator?: string, options?: fs.WriteFileOptions): void;
/**
 * @consideration maybe it would be better to have the delimiter be an explicit param rather
 * than implicitly determined by `outputPath`
 * - can write to `tsv` by having `outputPath` end with `'.tsv'`
 * @param rows `Record<string, any>[]` - array of objects to write to CSV
 * @param outputPath `string` - path to the output CSV file.
 * @returns **`void`**
 */
export declare function writeRowsToCsvSync(rows: Record<string, any>[], outputPath: string, headers?: string[]): void;
/**
 * @TODO handle other file extensions
 * @param maxMB - Maximum size in MB to keep in the file, default is `5` -> 5MB.
 * @param filePaths arbitrary number of text file paths to trim
 */
export declare function trimFileSync(maxMB?: number, ...filePaths: string[]): void;
export declare function trimFile(maxMB?: number, ...filePaths: string[]): Promise<void>;
/**
 * `sync` Clears the content of the specified log file(s).
 * @param filePaths - The path(s) to the log file(s) to clear.
 */
export declare function clearFileSync(...filePaths: string[]): void;
/**
 * `async` func to ensure files are cleared before proceeding.
 * @param filePaths - The path(s) to the log file(s) to clear.
 */
export declare function clearFile(...filePaths: string[]): Promise<void>;
/**
 * @param data `Record<string, any> | string` - JSON data to stringify
 * @param indent `number` `optional`, default=`0` - number of additional indents to add to each line
 * @param spaces `number` `optional`, default=`4`
 * @returns **`jsonString`** `string`
 */
export declare function indentedStringify(data: Record<string, any> | string, indent?: number, spaces?: number): string;
/**
 * @returns **`timestamp`** `string` = `(${MM}-${DD})_(${HH}.${mm}.${ss}.${ms})`
 */
export declare function getFileNameTimestamp(): string;
