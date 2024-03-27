"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PythonTransformationDialogWidget = void 0;
var _selectors = require("../../selectors");
var _widget = require("../../widget");
class PythonTransformationDialogWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this.selectors = this.getWrappedSelectors(_selectors.SELECTORS.headerMenu.pythonTransformationDialog);
  }
  selectMaterialByIndex(index) {
    exabrowser.scrollAndClick(this.wrappedSelectors.materialsSelector);
    exabrowser.scrollAndClick(_selectors.SELECTORS.headerMenu.pythonTransformationDialog.materialsSelectorItem(index));
  }
  selectDropdownItemByTitle(title) {
    exabrowser.scrollAndClick(this.wrappedSelectors.transformationSelector);
    exabrowser.scrollAndClick(_selectors.SELECTORS.headerMenu.pythonTransformationDialog.transformationSelectorItem(title));
  }

  // eslint-disable-next-line class-methods-use-this
  setCodeMirrorContent(editorId, content) {
    let preserveExistingContent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    exabrowser.execute(
    // eslint-disable-next-line no-shadow
    (editorId, content, preserveExistingContent) => {
      const element = document.getElementById(editorId);
      const editor = element.getElementsByClassName("cm-content")[0].cmView.view;
      editor.focus();
      const stateLength = editor.state.doc.length;
      const transactionPayload = preserveExistingContent ? {
        changes: {
          from: stateLength,
          insert: "\n".concat(content)
        }
      } : {
        changes: {
          from: 0,
          to: stateLength,
          insert: content
        }
      };
      const transaction = editor.state.update(transactionPayload);
      editor.dispatch(transaction);
    }, editorId, content, preserveExistingContent);
  }

  // eslint-disable-next-line class-methods-use-this
  getCodeMirrorContent(editorId) {
    // eslint-disable-next-line no-shadow
    return exabrowser.execute(editorId => {
      const element = document.getElementById(editorId);
      return element.getElementsByClassName("cm-content")[0].cmView.view.state.doc.toString();
    }, editorId).value;
  }
  run() {
    exabrowser.waitForClickable(this.wrappedSelectors.runButton, 20000);
    exabrowser.scrollAndClick(this.wrappedSelectors.runButton);
    exabrowser.waitForClickable(this.wrappedSelectors.runButton, 20000);
  }
  clearOutput(index) {
    exabrowser.scrollAndClick(this.wrappedSelectors.clearOutputButton(index));
  }
  submit() {
    exabrowser.scrollAndClick(this.wrappedSelectors.submitButton);
  }
  cancel() {
    exabrowser.scrollAndClick(this.wrappedSelectors.cancelButton);
  }
}
exports.PythonTransformationDialogWidget = PythonTransformationDialogWidget;