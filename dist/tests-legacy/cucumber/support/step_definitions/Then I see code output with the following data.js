"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _assert = require("assert");
var _selectors = require("../selectors");
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.Then(/^I see code output with the following data:$/, docString => {
    const {
      pythonTransformationDialog
    } = _material_designer_page.materialDesignerPage.designerWidget;
    const editorId = _selectors.SELECTORS.headerMenu.pythonTransformationDialog.pythonOutput(0);
    const content = pythonTransformationDialog.getCodeMirrorContent(editorId);
    (0, _assert.deepEqual)(content.trim(), docString);
  });
}