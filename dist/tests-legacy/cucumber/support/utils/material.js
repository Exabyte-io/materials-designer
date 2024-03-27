"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xyzEqual = xyzEqual;
var _underscore = _interopRequireDefault(require("underscore.string"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * @summary Returns true if passed XYZ lines are equal.
 * E.g. "Si 0.25 0.25 0.25" and "Si 0.250000000 0.250000000 0.250000000" are equal.
 * @param line1 {String}
 * @param line2 {String}
 */
function xyzLinesEqual(line1, line2) {
  const words1 = _underscore.default.words(line1);
  const words2 = _underscore.default.words(line2);
  if (words1.length !== words2.length) {
    return false;
  }
  return words1[0] === words2[0] && parseFloat(words1[1]) === parseFloat(words2[1]) && parseFloat(words1[2]) === parseFloat(words2[2]) && parseFloat(words1[3]) === parseFloat(words2[3]);
}

/**
 * @summary Returns true, if passed XYZ strings are equal.
 * E.g. "Si 0 0 0\nSi 0.25 0.25 0.25" and
 * "Si 0.00000000 0.00000000 0.00000000\nSi 0.250000000 0.250000000 0.250000000" are equal.
 * @param xyz1 {String}
 * @param xyz2 {String}
 */
function xyzEqual(xyz1, xyz2) {
  const lines1 = _underscore.default.lines(xyz1).filter(x => x.trim() !== "");
  const lines2 = _underscore.default.lines(xyz2).filter(x => x.trim() !== "");
  if (lines1.length !== lines2.length) {
    return false;
  }
  for (let i = 0; i < lines1.length; i++) {
    if (!xyzLinesEqual(lines1[i], lines2[i])) {
      return false;
    }
  }
  return true;
}