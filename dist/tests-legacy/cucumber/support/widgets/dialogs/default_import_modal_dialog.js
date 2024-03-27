"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultImportModalDialogWidget = exports.DefaultImportModalDialogWidget = void 0;
var _utils = require("@mat3ra/code/dist/js/utils");
var _path = _interopRequireDefault(require("path"));
var _selectors = require("../../selectors");
var _widget = require("../../widget");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class DefaultImportModalDialogWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this.selectors = this.getWrappedSelectors(_selectors.SELECTORS.headerMenu.defaultImportModalDialog);
  }

  // eslint-disable-next-line default-param-last
  uploadFiles() {
    let filenames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const directory = _path.default.resolve(__dirname, "../../../fixtures");
    (0, _utils.safeMakeArray)(filenames).forEach(_ref => {
      let {
        filename
      } = _ref;
      return this.uploadFile(_path.default.join(directory, filename));
    });
  }
  uploadFile(filePath) {
    // Make input visible
    exabrowser.execute(selector => {
      const elem = document.querySelector(selector);
      elem.style.display = "block";
      elem.hidden = false;
    }, this.selectors.uploadInput);
    exabrowser.waitForVisible(this.selectors.uploadInput);
    // Upload the file
    exabrowser.chooseFileWithClear(this.selectors.uploadInput, filePath);
    // Hide the input again
    exabrowser.execute(selector => {
      const elem = document.querySelector(selector);
      elem.style.display = "none";
      elem.hidden = true;
    }, this.selectors.uploadInput);
  }
  verifyFilesInGrid(expectedFiles) {
    expectedFiles.forEach(file => {
      const fileNameSelector = this.selectors.gridFileName(file.filename);
      exabrowser.waitForVisible(fileNameSelector);
    });
  }
  verifyFormatsInGrid(expectedFiles) {
    expectedFiles.forEach(file => {
      const formatSelector = this.selectors.gridFormat(file.format);
      exabrowser.waitForVisible(formatSelector);
    });
  }
  removeFile(file) {
    // filename has dots in it which messes with css selectors -> replace them with dashes
    const escapedFileName = file.filename.replace(/\./g, "-");
    const removeButtonSelector = this.selectors.removeButton(escapedFileName);
    exabrowser.waitForVisibleClickableOrExist(removeButtonSelector);
    exabrowser.scrollAndClick(removeButtonSelector);
  }
  addButtonExists() {
    exabrowser.waitForVisibleClickableOrExist(this.selectors.addButton);
  }
  submit() {
    exabrowser.waitForVisibleClickableOrExist(this.selectors.submitButton);
    exabrowser.scrollAndClick(this.selectors.submitButton);
  }
  cancel() {
    exabrowser.waitForVisibleClickableOrExist(this.selectors.cancelButton);
    exabrowser.scrollAndClick(this.selectors.cancelButton);
  }
}
exports.DefaultImportModalDialogWidget = DefaultImportModalDialogWidget;
const defaultImportModalDialogWidget = exports.defaultImportModalDialogWidget = new DefaultImportModalDialogWidget(_selectors.SELECTORS.headerMenu.defaultImportModalDialog);