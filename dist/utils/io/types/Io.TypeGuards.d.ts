/**
 * @file src/utils/io/types/typeGuards.ts
 */
import { FileData, NodeLeaves, NodeStructure, DirectoryFileOptions, RowDictionary, RowSourceMetaData, WriteJsonOptions } from ".";
/**
 * @param value `any`
 * @returns **`isRowSourceMetaData`** `boolean`
 * - **`true`** `if` `value` is an object such that
 * each of its keys is a string that maps to an integer array
 * - **`false`** `otherwise`
 */
export declare function isRowSourceMetaData(value: any): value is RowSourceMetaData;
/**
 * - {@link RowDictionary} = `{ [rowIndex: number]: Record<string, any>; }`
 * @param value
 * @returns
 */
export declare function isRowDictionary(value: any): value is RowDictionary;
export declare function isNodeStructure(value: any): value is NodeStructure;
export declare function isNodeLeaves(value: any): value is NodeLeaves | number[] | RowDictionary;
export declare function isWriteJsonOptions(value: any): value is WriteJsonOptions;
/**
 * @consideration `FILE_NAME_WITH_EXTENSION_PATTERN = /^[^/\\:*?"<>|]+(\.[^/\\:*?"<>|]+)$/`
 * @param value `any`
 * @returns **`isFileData`** `boolean`
 * - **`true`** if the `value` is a {@link FileData} object with keys `fileName` and `fileContent`,
 * where `fileName` is a string and `fileContent` is a base64 encoded string,
 * - && fileNamePattern.test(value.fileName)
 * - **`false`** `otherwise`.
 */
export declare function isFileData(value: any): value is FileData;
export declare function isDirectoryFileOptions(value: unknown): value is DirectoryFileOptions;
