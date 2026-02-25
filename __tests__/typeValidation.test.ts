/**
 * @file ./__tests__/typeValidation.test.ts
 */

import { test, describe, expect } from "@jest/globals";
import * as TV from "../src/utils/typeValidation";

const cases = {
    stringArray: {
        mixedElements: ['abc', 123, false]
    }
} as const;

describe('typeValidation Module', () => {
    test('isStringArray(mixedElements)', () => {
        expect(TV.isStringArray(cases.stringArray.mixedElements)).toBe(false)
    })
});

// ============================================================================
// 
// ============================================================================

