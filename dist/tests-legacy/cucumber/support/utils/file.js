"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateFeatureFiles = generateFeatureFiles;
exports.readFileSync = readFileSync;
exports.writeFileSync = writeFileSync;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _template = require("./template");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-shadow
function readFileSync(path) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    encoding: "utf8"
  };
  return _fs.default.readFileSync(path, options);
}

// eslint-disable-next-line no-shadow
function writeFileSync(path, data) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  _fs.default.writeFileSync(path, data, options);
}
function generateFeatureFiles(configs, template, dst) {
  configs.forEach(config => {
    const path_ = _path.default.resolve(dst, "".concat(config.FEATURE_NAME, ".feature"));
    writeFileSync(path_, (0, _template.renderJinjaTemplate)(template, config));
  });
}