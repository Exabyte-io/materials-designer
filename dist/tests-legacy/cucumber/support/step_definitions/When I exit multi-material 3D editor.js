"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.Then(/^I exit multi-material 3D editor$/, () => {
    _material_designer_page.materialDesignerPage.designerWidget.threeJSEditorWidget.clickOnMenuItem("File", "Exit");
    _material_designer_page.materialDesignerPage.designerWidget.threeJSEditorWidget.waitForModalBackdropDisappear();
    _material_designer_page.materialDesignerPage.designerWidget.waitForVisible();
    _material_designer_page.materialDesignerPage.designerWidget.waitForLoaderToDisappear();
  });
}