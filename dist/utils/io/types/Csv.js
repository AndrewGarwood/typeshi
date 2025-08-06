"use strict";
/**
 * @file src/utils/io/types/Csv.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelimiterCharacterEnum = exports.DelimitedFileTypeEnum = void 0;
/**
 * @enum {string} **`DelimitedFileTypeEnum`**
 * @property {string} CSV = `'csv'` Comma-separated values -> `.csv` file.
 * @property {string} TSV = `'tsv'` Tab-separated values -> `.tsv` file.
 * @property {string} AUTO = `'auto'`- call {@link getDelimiterFromFilePath}(filePath, fileType) to detect file type based on file extension.
 */
var DelimitedFileTypeEnum;
(function (DelimitedFileTypeEnum) {
    DelimitedFileTypeEnum["CSV"] = "csv";
    DelimitedFileTypeEnum["TSV"] = "tsv";
    DelimitedFileTypeEnum["AUTO"] = "auto";
})(DelimitedFileTypeEnum || (exports.DelimitedFileTypeEnum = DelimitedFileTypeEnum = {}));
/**
 * @enum {string} **`DelimiterCharacterEnum`**
 * @property {string} TAB = `'\t'` - Tab character used as a delimiter.
 * @property {string} COMMA = `','` - Comma character used as a delimiter.
 * @description The DelimiterEnum enum defines the possible delimiters for CSV files.
 */
var DelimiterCharacterEnum;
(function (DelimiterCharacterEnum) {
    DelimiterCharacterEnum["TAB"] = "\t";
    DelimiterCharacterEnum["COMMA"] = ",";
})(DelimiterCharacterEnum || (exports.DelimiterCharacterEnum = DelimiterCharacterEnum = {}));
