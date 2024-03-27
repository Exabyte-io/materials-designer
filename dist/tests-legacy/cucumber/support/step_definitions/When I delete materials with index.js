"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.When(/^I delete materials with index "([^"]*)"$/, index => {
    if (!index) throw new Error("I click delete action from the Edit menu - index is undefined");
    _material_designer_page.materialDesignerPage.designerWidget.clickDeleteAction(index);
  });
}