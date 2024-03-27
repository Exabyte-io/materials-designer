"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _table = require("../utils/table");
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.When(/^I make multiple-selection with the following coordinates:$/, function (table) {
    const coordinates = (0, _table.parseTable)(table, this)[0];
    _material_designer_page.materialDesignerPage.designerWidget.threeJSEditorWidget.makeMultipleSelection(coordinates);
  });
}