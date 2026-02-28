/**
 * @file src/utils/regex/types/StringOptions.TypeGuards.ts
 */
import { 
    StringCaseEnum, StringCleanOptions, StringPadEnum, 
    StringPadOptions, StringReplaceParams, StringStripOptions, StringCondition, StringStripCondition 
} from "./StringOptions";
import { hasKeys, isFunction, isNonEmptyArray, isNonEmptyString, isObject, isPositveInteger, isUndefinedOr } from "../../typeValidation";


export function isStringCleanOptions(value: unknown): value is StringCleanOptions {
    const candidate = value as StringCleanOptions;
    return (isObject(candidate, false)
        && isUndefinedOr.type(candidate.strip, isStringStripOptions)
        && isUndefinedOr.type(candidate.pad, isStringPadOptions)
        && isUndefinedOr.type(candidate.case, isStringCaseEnum)
        && isUndefinedOr.array(candidate.replace, isStringReplaceParams)
        && isUndefinedOr.boolean(candidate.useDefault)
    );
}

export function isStringStripOptions(value: unknown): value is StringStripOptions {
    const candidate = value as StringStripOptions;
    return (isObject(candidate, false)
        && (isUndefinedOr.string(candidate.char) || candidate.char instanceof RegExp)
        && isUndefinedOr.type(candidate.left, isStringStripCondition)
        && isUndefinedOr.type(candidate.right, isStringStripCondition)
    )
}

export function isStringPadOptions(value: unknown): value is StringPadOptions {
    const candidate = value as StringPadOptions;
    return (isObject(candidate)
        && isPositveInteger(candidate.maxLength)
        && isUndefinedOr.string(candidate.char) //  && candidate.char.length === 1
        && isUndefinedOr.type(candidate.side, isStringPadEnum)
    );
    
}

export function isStringCaseEnum(value: unknown): value is StringCaseEnum {
    return (isNonEmptyString(value)
        && Object.values(StringCaseEnum).includes(value as StringCaseEnum)
    );
}

export function isStringPadEnum(value: unknown): value is StringPadEnum {
    return (isNonEmptyString(value)
        && Object.values(StringPadEnum).includes(value as StringPadEnum)
    );
}

export function isStringReplaceParams(value: unknown): value is StringReplaceParams {
    const candidate = value as StringReplaceParams;
    return (isObject(candidate)
        && (typeof candidate.searchValue === 'string' 
            || candidate.searchValue instanceof RegExp)
        && (typeof candidate.replaceValue === 'string')
    );
}

export function isStringCondition(value: unknown): value is StringCondition {
    const candidate = value as StringCondition;
    return (isObject(candidate)
        && isFunction(candidate.condition)
        && isUndefinedOr.array(candidate.args)
    );
}

export function isStringStripCondition(value: unknown): value is StringStripCondition {
    const candidate = value as StringStripCondition;
    return (isObject(candidate)
        && isFunction(candidate.condition)
        && isUndefinedOr.array(candidate.args)
        && isUndefinedOr.positiveInteger(candidate.max)
    );
}
