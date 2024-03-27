"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _table = require("../utils/table");
var _material_designer_page = require("../widgets/material_designer_page");
function _default() {
  this.When(/^I set material basis and lattice with the following data:$/, function (table) {
    const config = (0, _table.parseTable)(table, this)[0];
    const materialsDesigner = _material_designer_page.materialDesignerPage.designerWidget;
    materialsDesigner.sourceEditor.basisEditor.setBasis(config.basis);
    materialsDesigner.sourceEditor.latticeEditor.setLattice(JSON.parse(config.lattice));
  });
}