/**
 * @file ./__tests__/object.test.ts
 */
import { test, describe, expect } from "@jest/globals";
import { enforceMaxLength } from "../src/utils/object";

describe("enforceMaxLength", () => {
    describe("returns original array unchanged", () => {
        test("when maxLength is negative", () => {
            const arr = [1, 2, 3];
            const result = enforceMaxLength(arr, -1);
            expect(result).toBe(arr);
            expect(result).toEqual([1, 2, 3]);
        });

        test("when arr.length === maxLength", () => {
            const arr = [1, 2, 3];
            const result = enforceMaxLength(arr, 3);
            expect(result).toBe(arr);
            expect(result).toEqual([1, 2, 3]);
        });

        test("when arr.length < maxLength", () => {
            const arr = [1, 2];
            const result = enforceMaxLength(arr, 5);
            expect(result).toBe(arr);
            expect(result).toEqual([1, 2]);
        });
    });

    describe("floors maxLength", () => {
        test("float maxLength is floored before comparison", () => {
            const arr = [1, 2, 3, 4, 5];
            const result = enforceMaxLength(arr, 3.9, "LIFO", false);
            expect(result).toEqual([1, 2, 3]);
        });

        test("arr.length <= floored maxLength returns original", () => {
            const arr = [1, 2, 3];
            const result = enforceMaxLength(arr, 3.7);
            expect(result).toBe(arr);
            expect(result).toEqual([1, 2, 3]);
        });
    });

    describe("maxLength === 0", () => {
        test("inPlace = true: empties and returns original array", () => {
            const arr = [1, 2, 3];
            const result = enforceMaxLength(arr, 0, "LIFO", true);
            expect(result).toBe(arr);
            expect(result).toEqual([]);
        });

        test("inPlace = false: returns new empty array", () => {
            const arr = [1, 2, 3];
            const result = enforceMaxLength(arr, 0, "LIFO", false);
            expect(result).not.toBe(arr);
            expect(result).toEqual([]);
            expect(arr).toEqual([1, 2, 3]); // original untouched
        });
    });

    describe("LIFO (default) - removes from end", () => {
        test("inPlace = true: truncates array in place", () => {
            const arr = [1, 2, 3, 4, 5];
            const result = enforceMaxLength(arr, 3);
            expect(result).toBe(arr);
            expect(result).toEqual([1, 2, 3]);
        });

        test("inPlace = false: returns new sliced array", () => {
            const arr = [1, 2, 3, 4, 5];
            const result = enforceMaxLength(arr, 3, "LIFO", false);
            expect(result).not.toBe(arr);
            expect(result).toEqual([1, 2, 3]);
            expect(arr).toEqual([1, 2, 3, 4, 5]); // original untouched
        });
    });

    describe("FIFO - removes from front", () => {
        test("inPlace = true: splices from front in place", () => {
            const arr = [1, 2, 3, 4, 5];
            const result = enforceMaxLength(arr, 3, "FIFO", true);
            expect(result).toBe(arr);
            expect(result).toEqual([3, 4, 5]);
        });

        test("inPlace = false: returns new array from end", () => {
            const arr = [1, 2, 3, 4, 5];
            const result = enforceMaxLength(arr, 3, "FIFO", false);
            expect(result).not.toBe(arr);
            expect(result).toEqual([3, 4, 5]);
            expect(arr).toEqual([1, 2, 3, 4, 5]); // original untouched
        });
    });

    describe("edge cases", () => {
        test("empty array returns original", () => {
            const arr: number[] = [];
            const result = enforceMaxLength(arr, 5);
            expect(result).toBe(arr);
            expect(result).toEqual([]);
        });

        test("maxLength = 1 keeps only first element (LIFO)", () => {
            const arr = ["a", "b", "c"];
            expect(enforceMaxLength(arr, 1, "LIFO", false)).toEqual(["a"]);
        });

        test("maxLength = 1 keeps only last element (FIFO)", () => {
            const arr = ["a", "b", "c"];
            expect(enforceMaxLength(arr, 1, "FIFO", false)).toEqual(["c"]);
        });

        test("works with non-primitive types", () => {
            const objs = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const result = enforceMaxLength(objs, 2, "LIFO", false);
            expect(result).toEqual([{ id: 1 }, { id: 2 }]);
            expect(result[0]).toBe(objs[0]); // same references
        });
    });
});