/**
 * @summary Deeply compares passed objects, uses threshold for numbers.
 * https://github.com/gbezyuk/chai-shallow-deep-almost-equal/blob/master/chai-shallow-deep-almost-equal.js
 * @return {boolean}
 */
export function shallowDeepAlmostEqual(
    expect: unknown,
    actual: unknown,
    path = "",
    threshold = 0.01,
) {
    // null value
    if (expect === null) {
        if (!(actual === null)) {
            throw new Error(`Expected to have null but got "${actual}" at path "${path}".`);
        }

        return true;
    }

    // undefined expected value
    if (typeof expect === "undefined") {
        if (typeof actual !== "undefined") {
            throw new Error(`Expected to have undefined but got "${actual}" at path "${path}".`);
        }

        return true;
    }

    // scalar description
    if (/boolean|string/.test(typeof expect)) {
        if (expect !== actual) {
            throw new Error(`Expected to have "${expect}" but got "${actual}" at path "${path}".`);
        }

        return true;
    }

    // numbers — here is some important 'almost equal' stuff
    // TODO: configurable threshold
    if (typeof expect === "number") {
        if (typeof actual !== "number") {
            throw new Error(`Expected to have number but got "${actual}" at path "${path}".`);
        }
        if (Math.abs(expect - actual) > threshold) {
            throw new Error(
                `Expected to have "${expect}+-${threshold}" but got "${actual}" at path "${path}".`,
            );
        }

        return true;
    }

    // dates
    if (expect instanceof Date) {
        if (actual instanceof Date) {
            if (expect.getTime() !== actual.getTime()) {
                throw new Error(
                    `Expected to have date "${expect.toISOString()}" but got "${actual.toISOString()}" at path "${path}".`,
                );
            }
        } else {
            throw new Error(
                `Expected to have date "${expect.toISOString()}" but got "${actual}" at path "${path}".`,
            );
        }
    }

    if (actual === null) {
        throw new Error(`Expected to have an array/object but got null at path "${path}".`);
    }

    // array/object description
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const prop in expect) {
        if (typeof actual[prop] === "undefined" && typeof expect[prop] !== "undefined") {
            throw new Error(`Expected "${prop}" field to be defined at path "${path}".`);
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
