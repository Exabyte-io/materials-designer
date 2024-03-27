"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _path = _interopRequireDefault(require("path"));
var _utils = require("../utils");
var _file = require("../utils/file");
var _table = require("../utils/table");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _default() {
  this.Then(/^material with following data exists in state$/, function (table) {
    const config = (0, _table.parseTable)(table, this)[0];
    const material = JSON.parse((0, _file.readFileSync)(_path.default.resolve(__dirname, "../../fixtures", config.path)));
    (0, _utils.retry)(() => {
      const materials = exabrowser.execute(() => {
        return window.MDContainer.store.getState().present.materials.map(m => m.toJSON());
      }).value;
      (0, _utils.shallowDeepAlmostEqual)(material, materials[config.index - 1]);
    }, {
      retries: 5
    });
  });
}