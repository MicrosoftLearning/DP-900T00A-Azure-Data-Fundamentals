// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
function normalizeName(name) {
    return name.toLowerCase();
}
class HttpHeadersImpl {
    constructor(rawHeaders) {
        this._headersMap = new Map();
        if (rawHeaders) {
            for (const headerName of Object.keys(rawHeaders)) {
                this.set(headerName, rawHeaders[headerName]);
            }
        }
    }
    /**
     * Set a header in this collection with the provided name and value. The name is
     * case-insensitive.
     * @param name - The name of the header to set. This value is case-insensitive.
     * @param value - The value of the header to set.
     */
    set(name, value) {
        this._headersMap.set(normalizeName(name), String(value));
    }
    /**
     * Get the header value for the provided header name, or undefined if no header exists in this
     * collection with the provided name.
     * @param name - The name of the header. This value is case-insensitive.
     */
    get(name) {
        return this._headersMap.get(normalizeName(name));
    }
    /**
     * Get whether or not this header collection contains a header entry for the provided header name.
     * @param name - The name of the header to set. This value is case-insensitive.
     */
    has(name) {
        return this._headersMap.has(normalizeName(name));
    }
    /**
     * Remove the header with the provided headerName.
     * @param name - The name of the header to remove.
     */
    delete(name) {
        this._headersMap.delete(normalizeName(name));
    }
    /**
     * Get the JSON object representation of this HTTP header collection.
     */
    toJSON() {
        const result = {};
        for (const [key, value] of this._headersMap) {
            result[key] = value;
        }
        return result;
    }
    /**
     * Get the string representation of this HTTP header collection.
     */
    toString() {
        return JSON.stringify(this.toJSON());
    }
    /**
     * Iterate over tuples of header [name, value] pairs.
     */
    [Symbol.iterator]() {
        return this._headersMap.entries();
    }
}
/**
 * Creates an object that satisfies the `HttpHeaders` interface.
 * @param rawHeaders - A simple object representing initial headers
 */
export function createHttpHeaders(rawHeaders) {
    return new HttpHeadersImpl(rawHeaders);
}
//# sourceMappingURL=httpHeaders.js.map