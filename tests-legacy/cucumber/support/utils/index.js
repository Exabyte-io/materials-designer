/* eslint-disable no-throw-literal */
// eslint-disable-next-line import/no-unresolved
import sleep from "sleep";

import { logger } from "../logger";

/**
 * @summary Synchronous retry operation.
 * @param fn {Function} function to execute
 * @param options {Object} Retry options
 * @param options.retries {Number} Retries count
 * @param options.interval {Number} Pause between retries in milliseconds
 * @param options.context {Object} Context for specified function execution
 */
export function retry(fn, options = {}) {
    let i;
    const { retries = 60, interval = 1000, context = {} } = options;
    for (i = 0; i < retries; i++) {
        try {
            fn.apply(context);
            break;
        } catch (e) {
            logger.info(`retry #${i}, failed: ${e}, sleeping (ms): ${interval}`);
            sleep.usleep(interval * 1000);
        }
    }
    if (i >= retries) throw new Error("ERROR: Max retry count exceeded");
}

/**
 * @summary Deeply compares passed objects, uses threshold for numbers.
 * https://github.com/gbezyuk/chai-shallow-deep-almost-equal/blob/master/chai-shallow-deep-almost-equal.js
 * @return {boolean}
 */
export function shallowDeepAlmostEqual(expect, actual, path = "", threshold = 0.01) {
    // null value
    if (expect === null) {
        if (!(actual === null)) {
            throw `Expected to have null but got "${actual}" at path "${path}".`;
        }

        return true;
    }

    // undefined expected value
    if (typeof expect === "undefined") {
        if (typeof actual !== "undefined") {
            throw `Expected to have undefined but got "${actual}" at path "${path}".`;
        }

        return true;
    }

    // scalar description
    if (/boolean|string/.test(typeof expect)) {
        if (expect !== actual) {
            throw `Expected to have "${expect}" but got "${actual}" at path "${path}".`;
        }

        return true;
    }

    // numbers — here is some important 'almost equal' stuff
    // TODO: configurable threshold
    if (typeof expect === "number") {
        if (typeof actual !== "number") {
            throw `Expected to have number but got "${actual}" at path "${path}".`;
        }
        if (Math.abs(expect - actual) > threshold) {
            throw `Expected to have "${expect}+-${threshold}" but got "${actual}" at path "${path}".`;
        }

        return true;
    }

    // dates
    if (expect instanceof Date) {
        if (actual instanceof Date) {
            if (expect.getTime() !== actual.getTime()) {
                throw `Expected to have date "${expect.toISOString()}" but got "${actual.toISOString()}" at path "${path}".`;
            }
        } else {
            throw `Expected to have date "${expect.toISOString()}" but got "${actual}" at path "${path}".`;
        }
    }

    if (actual === null) {
        throw `Expected to have an array/object but got null at path "${path}".`;
    }

    // array/object description
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const prop in expect) {
        if (typeof actual[prop] === "undefined" && typeof expect[prop] !== "undefined") {
            throw `Expected "${prop}" field to be defined at path "${path}".`;
        }

        shallowDeepAlmostEqual(
            expect[prop],
            actual[prop],
            path + (path === "/" ? "" : "/") + prop,
            threshold,
        );
    }

    return true;
}
