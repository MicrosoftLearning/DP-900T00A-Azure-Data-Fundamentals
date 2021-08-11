// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { logger } from "../log";
import { RestError } from "../restError";
import { delay, getRandomIntegerInclusive } from "../util/helpers";
const DEFAULT_CLIENT_RETRY_COUNT = 10;
// intervals are in ms
const DEFAULT_CLIENT_RETRY_INTERVAL = 1000;
const DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 64;
/**
 * The programmatic identifier of the systemErrorRetryPolicy.
 */
export const systemErrorRetryPolicyName = "systemErrorRetryPolicy";
/**
 * A retry policy that specifically seeks to handle errors in the
 * underlying transport layer (e.g. DNS lookup failures) rather than
 * retryable error codes from the server itself.
 * @param options - Options that customize the policy.
 */
export function systemErrorRetryPolicy(options = {}) {
    var _a, _b, _c;
    const retryCount = (_a = options.maxRetries) !== null && _a !== void 0 ? _a : DEFAULT_CLIENT_RETRY_COUNT;
    const retryInterval = (_b = options.retryDelayInMs) !== null && _b !== void 0 ? _b : DEFAULT_CLIENT_RETRY_INTERVAL;
    const maxRetryInterval = (_c = options.maxRetryDelayInMs) !== null && _c !== void 0 ? _c : DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
    function shouldRetry(retryData, err) {
        if (!isSystemError(err)) {
            return false;
        }
        const currentCount = retryData.retryCount;
        return currentCount <= retryCount;
    }
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
        retryData = updateRetryData(retryData, requestError);
        if (shouldRetry(retryData, requestError)) {
            try {
                logger.info(`Retrying request in ${retryData.retryInterval}`);
                await delay(retryData.retryInterval);
                const res = await next(request);
                return retry(next, retryData, request, res);
            }
            catch (e) {
                return retry(next, retryData, request, response, e);
            }
        }
        else if (requestError || !response) {
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
        name: systemErrorRetryPolicyName,
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
function isSystemError(err) {
    if (!err) {
        return false;
    }
    return (err.code === "ETIMEDOUT" ||
        err.code === "ESOCKETTIMEDOUT" ||
        err.code === "ECONNREFUSED" ||
        err.code === "ECONNRESET" ||
        err.code === "ENOENT");
}
//# sourceMappingURL=systemErrorRetryPolicy.js.map