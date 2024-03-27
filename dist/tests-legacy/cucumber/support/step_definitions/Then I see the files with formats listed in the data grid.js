"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _table = require("../utils/table");
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.Then(/^I see the files with formats listed in the data grid$/, function (table) {
    const expectedFiles = (0, _table.parseTable)(table, this);
    _material_designer_page.materialDesignerPage.designerWidget.defaultImportModalDialog.verifyFilesInGrid(expectedFiles);
    _material_designer_page.materialDesignerPage.designerWidget.defaultImportModalDialog.verifyFormatsInGrid(expectedFiles);
  });
}