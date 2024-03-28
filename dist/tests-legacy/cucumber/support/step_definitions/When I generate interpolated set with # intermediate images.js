"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.When(/^I generate interpolated set with "([^"]*)" intermediate images$/, nImages => {
    _material_designer_page.materialDesignerPage.designerWidget.generateInterpolatedSet(parseInt(nImages));
  });
}