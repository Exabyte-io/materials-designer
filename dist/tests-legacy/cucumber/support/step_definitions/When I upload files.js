"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _table = require("../utils/table");
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.When(/^I upload files$/, function (table) {
    const filenames = (0, _table.parseTable)(table, this);
    _material_designer_page.materialDesignerPage.designerWidget.defaultImportModalDialog.uploadFiles(filenames);
  });
}