"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retry = retry;
exports.shallowDeepAlmostEqual = shallowDeepAlmostEqual;
var _sleep = _interopRequireDefault(require("sleep"));
var _logger = require("../logger");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable no-throw-literal */
// eslint-disable-next-line import/no-unresolved

/**
 * @summary Synchronous retry operation.
 * @param fn {Function} function to execute
 * @param options {Object} Retry options
 * @param options.retries {Number} Retries count
 * @param options.interval {Number} Pause between retries in milliseconds
 * @param options.context {Object} Context for specified function execution
 */
function retry(fn) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let i;
  const {
    retries = 60,
    interval = 1000,
    context = {}
  } = options;
  for (i = 0; i < retries; i++) {
    try {
      fn.apply(context);
      break;
    } catch (e) {
      _logger.logger.info("retry #".concat(i, ", failed: ").concat(e, ", sleeping (ms): ").concat(interval));
      _sleep.default.usleep(interval * 1000);
    }
  }
  if (i >= retries) throw new Error("ERROR: Max retry count exceeded");
}

/**
 * @summary Deeply compares passed objects, uses threshold for numbers.
 * https://github.com/gbezyuk/chai-shallow-deep-almost-equal/blob/master/chai-shallow-deep-almost-equal.js
 * @return {boolean}
 */
function shallowDeepAlmostEqual(expect, actual) {
  let path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  let threshold = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.01;
  // null value
  if (expect === null) {
    if (!(actual === null)) {
      throw "Expected to have null but got \"".concat(actual, "\" at path \"").concat(path, "\".");
    }
    return true;
  }

  // undefined expected value
  if (typeof expect === "undefined") {
    if (typeof actual !== "undefined") {
      throw "Expected to have undefined but got \"".concat(actual, "\" at path \"").concat(path, "\".");
    }
    return true;
  }

  // scalar description
  if (/boolean|string/.test(typeof expect)) {
    if (expect !== actual) {
      throw "Expected to have \"".concat(expect, "\" but got \"").concat(actual, "\" at path \"").concat(path, "\".");
    }
    return true;
  }

  // numbers — here is some important 'almost equal' stuff
  // TODO: configurable threshold
  if (typeof expect === "number") {
    if (typeof actual !== "number") {
      throw "Expected to have number but got \"".concat(actual, "\" at path \"").concat(path, "\".");
    }
    if (Math.abs(expect - actual) > threshold) {
      throw "Expected to have \"".concat(expect, "+-").concat(threshold, "\" but got \"").concat(actual, "\" at path \"").concat(path, "\".");
    }
    return true;
  }

  // dates
  if (expect instanceof Date) {
    if (actual instanceof Date) {
      if (expect.getTime() !== actual.getTime()) {
        throw "Expected to have date \"".concat(expect.toISOString(), "\" but got \"").concat(actual.toISOString(), "\" at path \"").concat(path, "\".");
      }
    } else {
      throw "Expected to have date \"".concat(expect.toISOString(), "\" but got \"").concat(actual, "\" at path \"").concat(path, "\".");
    }
  }
  if (actual === null) {
    throw "Expected to have an array/object but got null at path \"".concat(path, "\".");
  }

  // array/object description
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const prop in expect) {
    if (typeof actual[prop] === "undefined" && typeof expect[prop] !== "undefined") {
      throw "Expected \"".concat(prop, "\" field to be defined at path \"").concat(path, "\".");
    }
    shallowDeepAlmostEqual(expect[prop], actual[prop], path + (path === "/" ? "" : "/") + prop, threshold);
  }
  return true;
}