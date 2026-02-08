/**
 * @file src/utils/regex/types/StringOptions.TypeGuards.ts
 */
import { DEP_CleanStringOptions, StringCaseEnum, StringCleanOptions, StringPadEnum, StringPadOptions, StringReplaceParams, StringStripOptions, StringCondition, StringStripCondition } from "./StringOptions";
export declare function isStringCleanOptions(value: unknown): value is StringCleanOptions;
export declare function isStringStripOptions(value: unknown): value is StringStripOptions;
export declare function isStringPadOptions(value: unknown): value is StringPadOptions;
export declare function isStringCaseEnum(value: unknown): value is StringCaseEnum;
export declare function isStringPadEnum(value: unknown): value is StringPadEnum;
export declare function isStringReplaceParams(value: unknown): value is StringReplaceParams;
export declare function isStringCondition(value: unknown): value is StringCondition;
export declare function isStringStripCondition(value: unknown): value is StringStripCondition;
/**
 * - {@link DEP_CleanStringOptions}
 * @param value `any`
 * @returns **`isCleanStringOptions`** `boolean`
 * - **`true`** if the `value` is an object with at least one key in `['strip', 'case', 'pad', 'replace']` and no other keys,
 * - **`false`** `otherwise`.
 */
export declare function DEP_isCleanStringOptions(value: any): value is DEP_CleanStringOptions;
