/**
 * @file src/utils/io/types/typeGuards.ts
 */

import { 
    FileData, NodeLeaves, NodeStructure, DirectoryFileOptions,
    RowDictionary, RowSourceMetaData, WriteJsonOptions
} from ".";
import { isIntegerArray, isNonEmptyString, isOptional, isObject, isUndefinedOr } from "../../typeValidation";


/**
 * @param value `any`
 * @returns **`isRowSourceMetaData`** `boolean`
 * - **`true`** `if` `value` is an object such that 
 * each of its keys is a string that maps to an integer array
 * - **`false`** `otherwise`
 */
export function isRowSourceMetaData(value: any): value is RowSourceMetaData {
    return (value && typeof value === 'object'
        && Object.keys(value).every(key => 
            isNonEmptyString(key) && isIntegerArray(value[key])
        )
    );
}


/**
 * - {@link RowDictionary} = `{ [rowIndex: number]: Record<string, any>; }`
 * @param value 
 * @returns 
 */
export function isRowDictionary(value: any): value is RowDictionary {
    return (value && typeof value === 'object'
        && !Array.isArray(value)
        && Object.keys(value).length > 0
        && Object.keys(value).every(key => 
            !isNaN(Number(key))
            && Boolean(value[key]) 
            // is Record<string, any>
            && typeof value[key] === 'object' && !Array.isArray(value[key])
        )
    )
}


export function isNodeStructure(value: any): value is NodeStructure {
    const candidate = value as NodeStructure;
    return (isObject(candidate)
        && Object.entries(candidate).every(([k, v])=>
            isNonEmptyString(k) && (isNodeLeaves(v) || isNodeStructure(v)))
    );
}

export function isNodeLeaves(value: any): value is NodeLeaves | number[] | RowDictionary {
    return ((Array.isArray(value) && value.every(v => typeof v === 'number')) 
        || isRowDictionary(value)
    );
}

export function isWriteJsonOptions(value: any): value is WriteJsonOptions {
    const candidate = value as  WriteJsonOptions;
    return (isObject(candidate)
        && (typeof candidate.data === 'string' || isObject(candidate.data))
        && isNonEmptyString(candidate.filePath)
        && isUndefinedOr.positiveInteger(candidate.indent)
        && isUndefinedOr.boolean(candidate.enableOverwrite)
    );
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
export function isFileData(value: any): value is FileData {
    const candidate = value as FileData;
    return (isObject(candidate)
        && isNonEmptyString(candidate.fileName)
        && isNonEmptyString(candidate.fileContent)
    );
}

export function isDirectoryFileOptions(value: unknown): value is DirectoryFileOptions {
    const candidate = value as DirectoryFileOptions;
    return (isObject(candidate, false)
        && isOptional.stringArray(candidate.targetExtensions, false)
        && isOptional.boolean(candidate.basenameOnly)
        && isOptional.boolean(candidate.recursive)
    );
}