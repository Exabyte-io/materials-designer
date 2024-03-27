"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.Then(/^I open multi-material 3D editor$/, () => {
    _material_designer_page.materialDesignerPage.designerWidget.headerMenu.selectMenuItemByNameAndItemNumber("View", 1);
    _material_designer_page.materialDesignerPage.designerWidget.threeJSEditorWidget.waitForLoaderToDisappear();
  });
}