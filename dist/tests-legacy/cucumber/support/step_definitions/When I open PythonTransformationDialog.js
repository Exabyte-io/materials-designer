"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.When(/^I open PythonTransformationDialog$/, () => {
    _material_designer_page.materialDesignerPage.designerWidget.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 6);
  });
}