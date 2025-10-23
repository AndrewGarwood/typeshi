"use strict";
/**
 * @file src/utils/typeValidation.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUndefinedOr = exports.isOptional = exports.isType = exports.isEmpty = void 0;
exports.isNullLike = isNullLike;
exports.anyNull = anyNull;
exports.isNonEmptyArray = isNonEmptyArray;
exports.isEmptyArray = isEmptyArray;
exports.isIntegerArray = isIntegerArray;
exports.isStringArray = isStringArray;
exports.hasNonTrivialKeys = hasNonTrivialKeys;
exports.hasKeys = hasKeys;
exports.areEquivalentObjects = areEquivalentObjects;
exports.isNumeric = isNumeric;
exports.isNonEmptyString = isNonEmptyString;
exports.isPrimitiveValue = isPrimitiveValue;
exports.isInteger = isInteger;
exports.isObject = isObject;
exports.isPositveInteger = isPositveInteger;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isUndefined = isUndefined;
exports.isUndefinedOrNull = isUndefinedOrNull;
const index_1 = require("./regex/index");
/**
 * - alias for {@link isNullLike}
 * ... maybe should just change name of isNullLike but that might break things...
 * @param value `any` the value to check
 * @returns **`isNullLike`** `boolean` = `value is '' | (Array<any> & { length: 0 }) | null | undefined | Record<string, never>`
 * - **`true`** `if` the `value` is null, undefined, empty object (no keys), empty array, or empty string
 * - **`false`** `otherwise`
 */
exports.isEmpty = isNullLike;
/**
 * @param value `any` the value to check
 * @returns **`isNullLike`** `boolean` = `value is '' | (Array<any> & { length: 0 }) | null | undefined | Record<string, never>`
 * - **`true`** `if` the `value` is null, undefined, empty object (no keys), empty array, or empty string
 * - **`false`** `otherwise`
 */
function isNullLike(value) {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'boolean' || typeof value === 'number') {
        return false;
    }
    // Check for empty object or array
    if (typeof value === 'object' && isEmptyArray(Object.keys(value))) {
        return true;
    }
    const isNullLikeString = (typeof value === 'string'
        && (value.trim() === ''
            || value.toLowerCase() === 'undefined'
            || value.toLowerCase() === 'null'));
    if (isNullLikeString) {
        return true;
    }
    return false;
}
/**
 * @deprecated no type predicate b/c "A type predicate cannot reference a rest parameter.ts(1229)"
 * @param values `any[]`
 * @returns `values.some(v => `{@link isNullLike}`(v))`
 * - **`true`** `if` any of the values are null, undefined, empty object (no keys), empty array, or empty string
 * - **`false`** `otherwise`.
 */
function anyNull(...values) {
    if (values === null || values === undefined) {
        return true;
    }
    return values.some(v => isNullLike(v));
}
/**
 * @param value
 * @returns **`isNonEmptyArray`** `boolean` = `value is Array<any> & { length: number }`
 * - **`true`** if `value` is an array and has at least one element,
 * - **`false`** otherwise.
 */
function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}
/**
 * @param value `any`
 * @returns **`isEmptyArray`** `boolean` = `value is Array<any> & { length: 0 }`
 * - **`true`** if `value` is an array and has no elements,
 * - **`false`** `otherwise`
 */
function isEmptyArray(value) {
    return Array.isArray(value) && value.length === 0;
}
/**
 * @param value `any`
 * @returns **`isIntegerArray`** `boolean` = `value is Array<number> & { length: number }`
 * - **`true`** if `value` is an array with `length > 0` and each of its elements is an `integer`
 * - **`false`** `otherwise`
 */
function isIntegerArray(value, requireNonNegative = false) {
    return (value
        && isNonEmptyArray(value)
        && value.every(arrElement => isInteger(arrElement, requireNonNegative)));
}
/**
 * @consideration add param to allow for empty strings?
 * @param value `any`
 * @returns **`isStringArray`** `boolean` = `value is Array<string> & { length: number }`
 * - **`true`** if `value` is an array with `length > 0` and each of its elements is a **non-empty** `string`
 * - **`false`** `otherwise`
 */
function isStringArray(value) {
    return (isNonEmptyArray(value)
        && value.every(el => isNonEmptyString(el)));
}
/**
 * @note **passing in an array will return `false`.**
 * @note a value is considered trivial if {@link isNullLike}`(value)` returns `true` and vice versa
 * @param obj `any` The object to check.
 * @param requireAll `boolean` - flag indicating whether all values must be nontrivial or not
 * @returns **`hasNonTrivialKeys`** `boolean`
 * - **`true`** `if` the `obj` has non-empty keys,
 * - **`false`** `otherwise`
 */
function hasNonTrivialKeys(obj, requireAll = false) {
    if (!isObject(obj)) {
        return false;
    }
    return (requireAll
        ? Object.values(obj).every(v => !isNullLike(v))
        : Object.values(obj).some(v => !isNullLike(v)));
}
/**
 * @TODO add overload on param `keys` where keys = `{ required: string[], optional: string[] }`
 * @note uses `key in obj` for each element of param `keys`
 * @param obj `T extends Object` the object to check
 * @param keys `Array<keyof T> | string[] | string` the list of keys that obj must have
 * @param requireAll `boolean` defaults to `true`
 * - `if` `true`, all keys must be present in the object;
 * - `if` `false`, at least one key must be present
 * @param restrictKeys `boolean` defaults to `false`
 * - `if` `true`, only the keys provided in the `keys` param are allowed in the object;
 * - `if` `false`, the object can keys not included in the `keys` param.
 * @returns **`hasKeys`** `boolean`
 * - **`true`** `if` `obj` is of type 'object' and has the required key(s),
 * - **`false`** `otherwise`
 */
function hasKeys(obj, keys, requireAll = true, restrictKeys = false) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    if (keys === null || keys === undefined) {
        throw new Error('[hasKeys()] no keys provided: param `keys` must be defined');
    }
    if (!isNonEmptyArray(keys)) {
        keys = [keys]; // Convert string (assumed to be single key) to array of keys
    }
    let numKeysFound = 0;
    for (const key of keys) {
        if (key in obj) {
            numKeysFound++;
            if (!requireAll && !restrictKeys) {
                return true;
            }
        }
        else if (requireAll) { // and a key is not found
            return false;
        }
    }
    if (restrictKeys) {
        // If restrictKeys is true, check that no other keys are present in the object
        const objKeys = Object.keys(obj);
        const extraKeys = objKeys.filter(k => !keys.includes(k));
        if (extraKeys.length > 0) {
            return false; // Found keys not in the allowed list
        }
    }
    return requireAll ? numKeysFound === keys.length : numKeysFound > 0;
}
/**
 * @param objA `Record<string, any>`
 * @param objB `Record<string, any>`
 * @returns **`areEquivalentObjects`** `boolean`
 * - `true` `if` `objA` and `objB` are equivalent objects (same keys and values, including nested objects and arrays),
 * - `false` `otherwise`.
 */
function areEquivalentObjects(objA, objB) {
    if (!objA || typeof objA !== 'object' || !objB || typeof objB !== 'object') {
        return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length)
        return false;
    return keysA.every(key => {
        if (!hasKeys(objB, key))
            return false; // key not in both objects
        const valA = objA[key];
        const valB = objB[key];
        if (Array.isArray(valA) && Array.isArray(valB)) {
            return valA.length === valB.length
                && valA.every((item) => valB.includes(item));
        }
        else if (typeof valA === "object" && valA && typeof valB === "object" && valB) {
            return areEquivalentObjects(valA, valB);
        }
        return (0, index_1.equivalentAlphanumericStrings)(valA, valB);
    });
}
/**
 * @param value `any`
 * @param requireInteger `boolean` `default = false`
 * @param requireNonNegative `boolean` `default = false`
 * @returns **`isNumeric`** `value is string | number`
 * - **`true`** `if` `value` is either a `number` or a `string` that can be casted to a `number`
 * while also meeting the boolean parameter requirements
 * - **`false`** `otherwise`
 */
function isNumeric(value, requireInteger = false, requireNonNegative = false) {
    let numValue;
    if (typeof value === 'number') {
        numValue = value;
    }
    else if (isNonEmptyString(value)) {
        const trimmed = value.trim();
        if (isNaN(Number(trimmed))) {
            return false;
        }
        numValue = Number(trimmed);
    }
    else {
        return false;
    }
    if (requireInteger && !Number.isInteger(numValue)) {
        return false;
    }
    if (requireNonNegative && numValue < 0) {
        return false;
    }
    return true;
}
/**
 * @param value `any`
 * @returns **`isNonEmptyString`** `boolean`
 * - `true` `if` `value` is a non-empty string (not just whitespace),
 * - `false` `otherwise`.
 */
function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim() !== '';
}
function isPrimitiveValue(value) {
    if (value === null || value === undefined) {
        return true; // null and undefined are considered primitive
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return true; // string, number, and boolean are primitive types
    }
    return false;
}
/**
 * @param value `any`
 * @param requireNonNegative `boolean`
 * - `if` `true` then require that `value` be an integer `>= 0`
 * - `if` `false` then the sign of the number doesn't matter
 * @returns **`isInteger`** `boolean`
 */
function isInteger(value, requireNonNegative = false) {
    return (typeof value === 'number'
        && Number.isInteger(value)
        && (requireNonNegative ? value >= 0 : true));
}
/**
 * @param value `any`
 * @param requireNonEmpty `boolean` `default = true`
 * - `if` `true` then `value` must have at least 1 key
 * - `if` `false` then `value` is allowed to be an empty object
 * @param requireNonArray `boolean` `default = true`
 * - `if` `true` then `value` must not be an array
 * - `if` `false` then `value` is allowed to be an array
 * @returns **`isObject`** `boolean` `value is Record<string, any>`
 */
function isObject(value, requireNonEmpty = true, requireNonArray = true) {
    return (value && typeof value === 'object'
        && (requireNonArray ? !Array.isArray(value) : true)
        && (requireNonEmpty ? Object.keys(value).length > 0 : true));
}
// isPosInt
function isPositveInteger(value) {
    return (typeof value === 'number'
        && Number.isInteger(value)
        && value > 0);
}
const isType = (value, guard, ...args) => {
    return guard(value, ...args);
};
exports.isType = isType;
/**
 * - calls {@link isUndefinedOrNull}`(value)` which allows for value to be `undefined` or `null`
 * - use {@link isUndefinedOr} if you want value is `T | undefined`
 */
class isOptional {
}
exports.isOptional = isOptional;
isOptional.type = (value, guard, ...args) => {
    return isUndefinedOrNull(value) || (0, exports.isType)(value, guard, ...args);
};
/**
 * @param value
 * @param requireNonEmpty `bolean` `default` = `true`
 * @returns
 */
isOptional.string = (value, requireNonEmpty = true) => {
    return isUndefinedOrNull(value) || requireNonEmpty ? isNonEmptyString(value) : typeof value === "string";
};
isOptional.stringArray = (value) => {
    return isUndefinedOrNull(value) || isStringArray(value);
};
isOptional.numeric = (value, requireInteger = false, requireNonNegative = false) => {
    return isUndefinedOrNull(value) || isNumeric(value, requireInteger, requireNonNegative);
};
isOptional.number = (value, requireInteger = false, requireNonNegative = false) => {
    return isUndefinedOrNull(value) || (isNumeric(value, requireInteger, requireNonNegative)
        && typeof value === 'number');
};
isOptional.positiveInteger = (value) => {
    return (isUndefinedOrNull(value) || isPositveInteger(value));
};
isOptional.integerArray = (value, requireNonNegative = false) => {
    return isUndefinedOrNull(value) || isIntegerArray(value, requireNonNegative);
};
class isUndefinedOr {
}
exports.isUndefinedOr = isUndefinedOr;
isUndefinedOr.type = (value, guard, ...args) => {
    return isUndefined(value) || (0, exports.isType)(value, guard, ...args);
};
/**
 * @param value
 * @param requireNonEmpty `bolean` `default` = `true`
 * @returns
 */
isUndefinedOr.string = (value, requireNonEmpty = true) => {
    return isUndefined(value) || requireNonEmpty ? isNonEmptyString(value) : typeof value === "string";
};
isUndefinedOr.stringArray = (value) => {
    return isUndefined(value) || isStringArray(value);
};
isUndefinedOr.numeric = (value, requireInteger = false, requireNonNegative = false) => {
    return isUndefined(value) || isNumeric(value, requireInteger, requireNonNegative);
};
isUndefinedOr.number = (value, requireInteger = false, requireNonNegative = false) => {
    return isUndefined(value) || (isNumeric(value, requireInteger, requireNonNegative)
        && typeof value === 'number');
};
isUndefinedOr.positiveInteger = (value) => {
    return (isUndefined(value) || isPositveInteger(value));
};
isUndefinedOr.integerArray = (value, requireNonNegative = false) => {
    return isUndefined(value) || isIntegerArray(value, requireNonNegative);
};
/**
 * these may be unnecessary, but added for completeness
 */
/**
 * @param value `any`
 * @returns **`isBoolean`** `boolean`
 */
function isBoolean(value) {
    return (typeof value === 'boolean');
}
/**
 * @param value `any`
 * @returns **`isFunction`** `boolean`
 */
function isFunction(value) {
    return (typeof value === 'function');
}
/**
 * - passing in `null` returns `false`
 * @param value `any`
 * @returns **`isUndefined`** `boolean` `return value === undefined`
 */
function isUndefined(value) {
    return value === undefined;
}
function isUndefinedOrNull(value) {
    return value === undefined || value === null;
}
