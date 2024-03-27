"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _path = _interopRequireDefault(require("path"));
var _selectors = require("../selectors");
var _file = require("../utils/file");
var _material_designer_page = require("../widgets/material_designer_page");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _default() {
  this.Then(/^I set code input from the file "(.*)"$/, file => {
    const {
      pythonTransformationDialog
    } = _material_designer_page.materialDesignerPage.designerWidget;
    const editorId = _selectors.SELECTORS.headerMenu.pythonTransformationDialog.codeInput(0);
    const content = (0, _file.readFileSync)(_path.default.resolve(__dirname, "../../fixtures", file));
    pythonTransformationDialog.setCodeMirrorContent(editorId, content);
  });
}