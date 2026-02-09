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
exports.isDirectoryFileOptions = isDirectoryFileOptions;
const typeValidation_1 = require("../../typeValidation");
/**
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
    const candidate = value;
    return ((0, typeValidation_1.isObject)(candidate)
        && Object.entries(candidate).every(([k, v]) => (0, typeValidation_1.isNonEmptyString)(k) && (isNodeLeaves(v) || isNodeStructure(v))));
}
function isNodeLeaves(value) {
    return ((Array.isArray(value) && value.every(v => typeof v === 'number'))
        || isRowDictionary(value));
}
function isWriteJsonOptions(value) {
    const candidate = value;
    return ((0, typeValidation_1.isObject)(candidate)
        && (typeof candidate.data === 'string' || (0, typeValidation_1.isObject)(candidate.data))
        && (0, typeValidation_1.isNonEmptyString)(candidate.filePath)
        && typeValidation_1.isUndefinedOr.positiveInteger(candidate.indent)
        && typeValidation_1.isUndefinedOr.boolean(candidate.enableOverwrite));
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
    const candidate = value;
    return ((0, typeValidation_1.isObject)(candidate)
        && (0, typeValidation_1.isNonEmptyString)(candidate.fileName)
        && (0, typeValidation_1.isNonEmptyString)(candidate.fileContent));
}
function isDirectoryFileOptions(value) {
    const candidate = value;
    return ((0, typeValidation_1.isObject)(candidate, false)
        && typeValidation_1.isOptional.stringArray(candidate.targetExtensions, false)
        && typeValidation_1.isOptional.boolean(candidate.basenameOnly)
        && typeValidation_1.isOptional.boolean(candidate.recursive));
}
