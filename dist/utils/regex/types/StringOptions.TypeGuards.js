"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStringCleanOptions = isStringCleanOptions;
exports.isStringStripOptions = isStringStripOptions;
exports.isStringPadOptions = isStringPadOptions;
exports.isStringCaseEnum = isStringCaseEnum;
exports.isStringPadEnum = isStringPadEnum;
exports.isStringReplaceParams = isStringReplaceParams;
exports.isStringCondition = isStringCondition;
exports.isStringStripCondition = isStringStripCondition;
/**
 * @file src/utils/regex/types/StringOptions.TypeGuards.ts
 */
const StringOptions_1 = require("./StringOptions");
const typeValidation_1 = require("../../typeValidation");
function isStringCleanOptions(value) {
    const candidate = value;
    return ((0, typeValidation_1.isObject)(candidate, false)
        && typeValidation_1.isUndefinedOr.type(candidate.strip, isStringStripOptions)
        && typeValidation_1.isUndefinedOr.type(candidate.pad, isStringPadOptions)
        && typeValidation_1.isUndefinedOr.type(candidate.case, isStringCaseEnum)
        && typeValidation_1.isUndefinedOr.array(candidate.replace, isStringReplaceParams)
        && typeValidation_1.isUndefinedOr.boolean(candidate.useDefault));
}
function isStringStripOptions(value) {
    const candidate = value;
    return ((0, typeValidation_1.isObject)(candidate, false)
        && (typeValidation_1.isUndefinedOr.string(candidate.char) || candidate.char instanceof RegExp)
        && typeValidation_1.isUndefinedOr.type(candidate.left, isStringStripCondition)
        && typeValidation_1.isUndefinedOr.type(candidate.right, isStringStripCondition));
}
function isStringPadOptions(value) {
    const candidate = value;
    return ((0, typeValidation_1.isObject)(candidate)
        && (0, typeValidation_1.isPositveInteger)(candidate.maxLength)
        && typeValidation_1.isUndefinedOr.string(candidate.char) //  && candidate.char.length === 1
        && typeValidation_1.isUndefinedOr.type(candidate.side, isStringPadEnum));
}
function isStringCaseEnum(value) {
    return ((0, typeValidation_1.isNonEmptyString)(value)
        && Object.values(StringOptions_1.StringCaseEnum).includes(value));
}
function isStringPadEnum(value) {
    return ((0, typeValidation_1.isNonEmptyString)(value)
        && Object.values(StringOptions_1.StringPadEnum).includes(value));
}
function isStringReplaceParams(value) {
    const candidate = value;
    return ((0, typeValidation_1.isObject)(candidate)
        && (typeof candidate.searchValue === 'string'
            || candidate.searchValue instanceof RegExp)
        && (typeof candidate.replaceValue === 'string'));
}
function isStringCondition(value) {
    const candidate = value;
    return ((0, typeValidation_1.isObject)(candidate)
        && (0, typeValidation_1.isFunction)(candidate.condition)
        && typeValidation_1.isUndefinedOr.array(candidate.args));
}
function isStringStripCondition(value) {
    const candidate = value;
    return ((0, typeValidation_1.isObject)(candidate)
        && (0, typeValidation_1.isFunction)(candidate.condition)
        && typeValidation_1.isUndefinedOr.array(candidate.args)
        && typeValidation_1.isUndefinedOr.positiveInteger(candidate.max));
}
