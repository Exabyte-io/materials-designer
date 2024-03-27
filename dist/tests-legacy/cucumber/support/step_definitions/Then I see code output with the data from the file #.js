"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _assert = require("assert");
var _path = _interopRequireDefault(require("path"));
var _selectors = require("../selectors");
var _file = require("../utils/file");
var _material_designer_page = require("../widgets/material_designer_page");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _default() {
  this.Then(/^I see code output with the data from the file "(.*)"$/, file => {
    const {
      pythonTransformationDialog
    } = _material_designer_page.materialDesignerPage.designerWidget;
    const editorId = _selectors.SELECTORS.headerMenu.pythonTransformationDialog.pythonOutput(0);
    const expectedContent = (0, _file.readFileSync)(_path.default.resolve(__dirname, "../../fixtures", file));
    exabrowser.safelyScroll(_selectors.SELECTORS.headerMenu.pythonTransformationDialog.dialog);
    exabrowser.waitForVisible("#".concat(editorId), 20000);
    const content = pythonTransformationDialog.getCodeMirrorContent(editorId);
    (0, _assert.deepEqual)(content.replace(/\s/g, ""), expectedContent.replace(/\s/g, ""));
  });
}