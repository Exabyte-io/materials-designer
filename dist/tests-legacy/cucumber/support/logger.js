"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogger = getLogger;
exports.logger = void 0;
var _debug = _interopRequireDefault(require("debug"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-extraneous-dependencies

const LEVELS = {
  debug: 3,
  warn: 2,
  info: 1,
  error: 0
};
const DEBUG_LEVEL = process.env.DEBUG_LEVEL || LEVELS.warn;

/**
 * @summary Returns a logger with specified name.
 * @param name {String} E.g. "exachimp:widget"
 */
function getLogger(name) {
  const log = (0, _debug.default)(name);
  return {
    debug(message) {
      if (DEBUG_LEVEL >= LEVELS.debug) {
        log(message);
      }
    },
    warn(message) {
      if (DEBUG_LEVEL >= LEVELS.warn) {
        log(message);
      }
    },
    info(message) {
      if (DEBUG_LEVEL >= LEVELS.info) {
        log(message);
      }
    },
    error(message) {
      if (DEBUG_LEVEL >= LEVELS.error) {
        log(message);
      }
    }
  };
}
const logger = exports.logger = getLogger("exachimp:default");