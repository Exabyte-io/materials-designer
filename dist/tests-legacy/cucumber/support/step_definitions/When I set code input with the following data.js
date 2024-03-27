"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _selectors = require("../selectors");
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.When(/^I set code input with the following data:$/, docString => {
    const {
      pythonTransformationDialog
    } = _material_designer_page.materialDesignerPage.designerWidget;
    const editorId = _selectors.SELECTORS.headerMenu.pythonTransformationDialog.codeInput(0);
    pythonTransformationDialog.setCodeMirrorContent(editorId, docString);
  });
}