"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  // eslint-disable-next-line max-len
  this.Then(/^I select material with index "([^"]*)" from material designer items list$/, index => {
    _material_designer_page.materialDesignerPage.designerWidget.itemsList.selectItemByIndex(parseInt(index));
  });
}