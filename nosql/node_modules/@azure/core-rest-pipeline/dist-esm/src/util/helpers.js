// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
var _a;
/**
 * A constant that indicates whether the environment the code is running is Node.JS.
 * @internal
 */
export const isNode = typeof process !== "undefined" && Boolean(process.version) && Boolean((_a = process.versions) === null || _a === void 0 ? void 0 : _a.node);
/**
 * A wrapper for setTimeout that resolves a promise after t milliseconds.
 * @internal
 * @param t - The number of milliseconds to be delayed.
 * @param value - The value to be resolved with after a timeout of t milliseconds.
 * @returns Resolved promise
 */
export function delay(t, value) {
    return new Promise((resolve) => setTimeout(() => resolve(value), t));
}
/**
 * Returns a random integer value between a lower and upper bound,
 * inclusive of both bounds.
 * Note that this uses Math.random and isn't secure. If you need to use
 * this for any kind of security purpose, find a better source of random.
 * @param min - The smallest integer value allowed.
 * @param max - The largest integer value allowed.
 * @internal
 */
export function getRandomIntegerInclusive(min, max) {
    // Make sure inputs are integers.
    min = Math.ceil(min);
    max = Math.floor(max);
    // Pick a random offset from zero to the size of the range.
    // Since Math.random() can never return 1, we have to make the range one larger
    // in order to be inclusive of the maximum value after we take the floor.
    const offset = Math.floor(Math.random() * (max - min + 1));
    return offset + min;
}
/**
 * @internal
 * @returns true when input is an object type that is not null, Array, RegExp, or Date.
 */
export function isObject(input) {
    return (typeof input === "object" &&
        input !== null &&
        !Array.isArray(input) &&
        !(input instanceof RegExp) &&
        !(input instanceof Date));
}
//# sourceMappingURL=helpers.js.map