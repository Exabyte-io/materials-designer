"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.Then(/^I select "([^"]*)" option from the Edit menu$/, actionString => {
    const map = {
      undo: 1,
      redo: 2,
      reset: 3
    };
    const index = map[actionString];
    if (!index) throw new Error("I click # action from the Edit menu - index is undefined");
    _material_designer_page.materialDesignerPage.designerWidget.clickUndoRedoReset(index);
  });
}