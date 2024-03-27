"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateToString = dateToString;
exports.dateToUnix = dateToUnix;
var _moment = _interopRequireDefault(require("moment"));
var _underscore = _interopRequireDefault(require("underscore"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-unresolved

function dateToUnix(date) {
  return date.getTime() / 1000;
}
function dateToString(date) {
  let format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "MM/DD/YYYY";
  return _underscore.default.isString(date) ? date : (0, _moment.default)(date).format(format);
}