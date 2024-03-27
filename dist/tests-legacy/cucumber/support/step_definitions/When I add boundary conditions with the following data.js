"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _table = require("../utils/table");
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.When(/^I add boundary conditions with the following data:$/, function (table) {
    const config = (0, _table.parseTable)(table, this)[0];
    _material_designer_page.materialDesignerPage.designerWidget.addBoundaryConditions(config);
  });
}