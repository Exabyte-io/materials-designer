"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.Then(/^I select material with index "([^"]*)" in MaterialsSelector$/, index => {
    _material_designer_page.materialDesignerPage.designerWidget.pythonTransformationDialog.selectMaterialByIndex(index);
  });
}