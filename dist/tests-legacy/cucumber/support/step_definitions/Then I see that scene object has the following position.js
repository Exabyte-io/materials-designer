"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _assert = _interopRequireDefault(require("assert"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _table = require("../utils/table");
var _material_designer_page = require("../widgets/material_designer_page");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _default() {
  this.Then(/^I see that scene object has the following position:$/, function (table) {
    const config = (0, _table.parseTable)(table, this)[0];
    const expectedPosition = [config.x, config.y, config.z];
    const sceneObjectPosition = _material_designer_page.materialDesignerPage.designerWidget.threeJSEditorWidget.getSceneObjectPosition();
    (0, _assert.default)((0, _isEqual.default)(sceneObjectPosition, expectedPosition));
  });
}