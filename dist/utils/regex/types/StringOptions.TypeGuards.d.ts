/**
 * @file src/utils/regex/types/StringOptions.TypeGuards.ts
 */
import { StringCaseEnum, StringCleanOptions, StringPadEnum, StringPadOptions, StringReplaceParams, StringStripOptions, StringCondition, StringStripCondition } from "./StringOptions";
export declare function isStringCleanOptions(value: unknown): value is StringCleanOptions;
export declare function isStringStripOptions(value: unknown): value is StringStripOptions;
export declare function isStringPadOptions(value: unknown): value is StringPadOptions;
export declare function isStringCaseEnum(value: unknown): value is StringCaseEnum;
export declare function isStringPadEnum(value: unknown): value is StringPadEnum;
export declare function isStringReplaceParams(value: unknown): value is StringReplaceParams;
export declare function isStringCondition(value: unknown): value is StringCondition;
export declare function isStringStripCondition(value: unknown): value is StringStripCondition;
