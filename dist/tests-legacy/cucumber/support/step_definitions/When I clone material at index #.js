"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.Then(/^I clone material at index "([^"]*)"$/, index => {
    _material_designer_page.materialDesignerPage.designerWidget.itemsList.selectItemByIndex(parseInt(index));
    _material_designer_page.materialDesignerPage.designerWidget.headerMenu.selectMenuItemByNameAndItemNumber("Edit", 4);
  });
}