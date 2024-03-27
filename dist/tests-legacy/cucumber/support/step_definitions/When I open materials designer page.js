"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.When(/^I open materials designer page/, () => {
    _material_designer_page.materialDesignerPage.open("/", true);
  });
}