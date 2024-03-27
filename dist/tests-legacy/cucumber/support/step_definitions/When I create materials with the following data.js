"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _table = require("../utils/table");
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.When(/^I create materials with the following data$/, function (table) {
    const materialsDesigner = _material_designer_page.materialDesignerPage.designerWidget;
    const rows = (0, _table.parseTable)(table, this);
    materialsDesigner.createMultipleMaterials(rows);
  });
}