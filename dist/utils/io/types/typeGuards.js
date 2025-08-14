"use strict";
/**
 * @file src/utils/io/types/typeGuards.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRowSourceMetaData = isRowSourceMetaData;
exports.isRowDictionary = isRowDictionary;
exports.isNodeStructure = isNodeStructure;
exports.isNodeLeaves = isNodeLeaves;
exports.isWriteJsonOptions = isWriteJsonOptions;
exports.isFileData = isFileData;
const typeValidation_1 = require("../../typeValidation");
/**
 *
 * @param value `any`
 * @returns **`isRowSourceMetaData`** `boolean`
 * - **`true`** `if` `value` is an object such that
 * each of its keys is a string that maps to an integer array
 * - **`false`** `otherwise`
 */
function isRowSourceMetaData(value) {
    return (value && typeof value === 'object'
        && Object.keys(value).every(key => (0, typeValidation_1.isNonEmptyString)(key) && (0, typeValidation_1.isIntegerArray)(value[key])));
}
/**
 * - {@link RowDictionary} = `{ [rowIndex: number]: Record<string, any>; }`
 * @param value
 * @returns
 */
function isRowDictionary(value) {
    return (value && typeof value === 'object'
        && !Array.isArray(value)
        && Object.keys(value).length > 0
        && Object.keys(value).every(key => !isNaN(Number(key))
            && Boolean(value[key])
            // is Record<string, any>
            && typeof value[key] === 'object' && !Array.isArray(value[key])));
}
function isNodeStructure(value) {
    return (value && typeof value === 'object'
        && !Array.isArray(value)
        && Object.keys(value).length > 0
        && Object.entries(value).every(([key, value]) => typeof key === 'string'
            && (isNodeStructure(value) || isNodeLeaves(value))));
}
function isNodeLeaves(value) {
    return ((Array.isArray(value) && value.every(v => typeof v === 'number'))
        || isRowDictionary(value));
}
function isWriteJsonOptions(value) {
    return (value && typeof value === 'object'
        && !Array.isArray(value)
        && value.data !== undefined
        && (typeof value.data === 'object' || typeof value.data === 'string')
        && (0, typeValidation_1.isNonEmptyString)(value.filePath)
        && (value.indent === undefined
            || (typeof value.indent === 'number' && value.indent >= 0))
        && (value.enableOverwrite === undefined
            || typeof value.enableOverwrite === 'boolean'));
}
/**
 * @consideration `FILE_NAME_WITH_EXTENSION_PATTERN = /^[^/\\:*?"<>|]+(\.[^/\\:*?"<>|]+)$/`
 * @param value `any`
 * @returns **`isFileData`** `boolean`
 * - **`true`** if the `value` is a {@link FileData} object with keys `fileName` and `fileContent`,
 * where `fileName` is a string and `fileContent` is a base64 encoded string,
 * - && fileNamePattern.test(value.fileName)
 * - **`false`** `otherwise`.
 */
function isFileData(value) {
    return (value && typeof value === 'object'
        && (0, typeValidation_1.hasKeys)(value, ['fileName', 'fileContent'])
        && (0, typeValidation_1.isNonEmptyString)(value.fileName)
        // && fileNamePattern.test(value.fileName)
        && (0, typeValidation_1.isNonEmptyString)(value.fileContent));
}
