"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.materialDesignerPage = exports.MaterialDesignerPage = void 0;
var _page = require("../page");
var _selectors = require("../selectors");
var _material_designer_widget = require("./material_designer_widget");
class MaterialDesignerPage extends _page.Page {
  constructor(selector) {
    super(selector);
    this.designerWidget = new _material_designer_widget.MaterialDesignerWidget(_selectors.SELECTORS.wrapper);
  }
}
exports.MaterialDesignerPage = MaterialDesignerPage;
const materialDesignerPage = exports.materialDesignerPage = new MaterialDesignerPage(_selectors.SELECTORS.wrapper);