/**
 * @file ./__tests__/Str.test.ts
 */
import { test, describe, expect } from "@jest/globals";
import { Str, StringCleanOptions } from "../src/utils/regex";

describe('Str.contains()', () => {
    const s = 'this is a string_123456_string a is this';
    const re = new RegExp(/(?<=string_)\d+(?=_string)/);
    test('contains RegExp is true', () => {
        expect(Str.contains(s, re)).toBe(true);
    });
});