// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { logger } from "../log";
import { delay, getRandomIntegerInclusive } from "../util/helpers";
import { RestError } from "../restError";
/**
 * The programmatic identifier of the exponentialRetryPolicy.
 */
export const exponentialRetryPolicyName = "exponentialRetryPolicy";
const DEFAULT_CLIENT_RETRY_COUNT = 10;
// intervals are in ms
const DEFAULT_CLIENT_RETRY_INTERVAL = 1000;
const DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 64;
/**
 * A policy that attempts to retry requests while introducing an exponentially increasing delay.
 * @param options - Options that configure retry logic.
 */
export function exponentialRetryPolicy(options = {}) {
    var _a, _b, _c;
    const retryCount = (_a = options.maxRetries) !== null && _a !== void 0 ? _a : DEFAULT_CLIENT_RETRY_COUNT;
    const retryInterval = (_b = options.retryDelayInMs) !== null && _b !== void 0 ? _b : DEFAULT_CLIENT_RETRY_INTERVAL;
    const maxRetryInterval = (_c = options.maxRetryDelayInMs) !== null && _c !== void 0 ? _c : DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
    /**
     * Determines if the operation should be retried and how long to wait until the next retry.
     *
     * @param statusCode - The HTTP status code.
     * @param retryData -  The retry data.
     * @returns True if the operation qualifies for a retry; false otherwise.
     */
    function shouldRetry(response, retryData) {
        const statusCode = response === null || response === void 0 ? void 0 : response.status;
        if (statusCode === 503 && (response === null || response === void 0 ? void 0 : response.headers.get("Retry-After"))) {
            return false;
        }
        if (statusCode === undefined ||
            (statusCode < 500 && statusCode !== 408) ||
            statusCode === 501 ||
            statusCode === 505) {
            return false;
        }
        const currentCount = retryData && retryData.retryCount;
        return currentCount < retryCount;
    }
    /**
     * Updates the retry data for the next attempt.
     *
     * @param retryData -  The retry data.
     * @param err - The operation's error, if any.
     */
    function updateRetryData(retryData, err) {
        if (err) {
            if (retryData.error) {
                err.innerError = retryData.error;
            }
            retryData.error = err;
        }
        // Adjust retry count
        retryData.retryCount++;
        // Exponentially increase the delay each time
        const exponentialDelay = retryInterval * Math.pow(2, retryData.retryCount);
        // Don't let the delay exceed the maximum
        const clampedExponentialDelay = Math.min(maxRetryInterval, exponentialDelay);
        // Allow the final value to have some "jitter" (within 50% of the delay size) so
        // that retries across multiple clients don't occur simultaneously.
        const delayWithJitter = clampedExponentialDelay / 2 + getRandomIntegerInclusive(0, clampedExponentialDelay / 2);
        retryData.retryInterval = delayWithJitter;
        return retryData;
    }
    async function retry(next, retryData, request, response, requestError) {
        var _a;
        retryData = updateRetryData(retryData, requestError);
        const isAborted = (_a = request.abortSignal) === null || _a === void 0 ? void 0 : _a.aborted;
        if (!isAborted && shouldRetry(response, retryData)) {
            logger.info(`Retrying request in ${retryData.retryInterval}`);
            try {
                await delay(retryData.retryInterval);
                const res = await next(request);
                return retry(next, retryData, request, res);
            }
            catch (e) {
                return retry(next, retryData, request, response, e);
            }
        }
        else if (isAborted || requestError || !response) {
            // If the operation failed in the end, return all errors instead of just the last one
            const err = retryData.error ||
                new RestError("Failed to send the request.", {
                    code: RestError.REQUEST_SEND_ERROR,
                    statusCode: response === null || response === void 0 ? void 0 : response.status,
                    request: response === null || response === void 0 ? void 0 : response.request,
                    response
                });
            throw err;
        }
        else {
            return response;
        }
    }
    return {
        name: exponentialRetryPolicyName,
        async sendRequest(request, next) {
            const retryData = {
                retryCount: 0,
                retryInterval: 0
            };
            try {
                const response = await next(request);
                return retry(next, retryData, request, response);
            }
            catch (e) {
                const error = e;
                return retry(next, retryData, request, error.response, error);
            }
        }
    };
}
//# sourceMappingURL=exponentialRetryPolicy.js.map