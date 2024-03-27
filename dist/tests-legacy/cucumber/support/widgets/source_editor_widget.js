"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SourceEditorWidget = void 0;
var _selectors = require("../selectors");
var _widget = require("../widget");
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

class LatticeEditorWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this._selectors = this.getWrappedSelectors(_selectors.SELECTORS.sourceEditor.latticeEditor);
  }
  openLatticeForm() {
    exabrowser.scrollAndClick(this._selectors.latticeFormTrigger);
    exabrowser.waitForVisible(this._selectors.latticeFormBody);
  }
  closeLatticeForm() {
    exabrowser.scrollAndClick(this._selectors.latticeFormTrigger);
    exabrowser.waitForDisappear(this._selectors.latticeFormBody);
  }
  updateLatticeConfiguration() {
    exabrowser.scrollAndClick(this._selectors.latticeFormSaveButton);
  }

  // eslint-disable-next-line class-methods-use-this
  getLattice() {
    // TBA
  }
  setLatticeParamInput(name, value) {
    exabrowser.waitForVisible(this._selectors.latticeOptionSelectorByNameInput(name));
    exabrowser.setValue(this._selectors.latticeOptionSelectorByNameInput(name), value);
  }
  setLatticeParamSelect(name, value) {
    const selectSelector = this._selectors.latticeOptionSelectorByNameSelect(name);
    exabrowser.waitForVisible(selectSelector);
    exabrowser.click(selectSelector);
    const menuItemSelector = "li[data-value=\"".concat(value, "\"]");
    exabrowser.waitForVisible(menuItemSelector);
    exabrowser.click(menuItemSelector);
  }
  setLattice(latticeObject) {
    this.openLatticeForm();
    Object.keys(latticeObject).forEach(key => {
      const value = latticeObject[key];
      if (key === "type") this.setLatticeParamSelect(key, value);else this.setLatticeParamInput(key, value);
    });
    this.updateLatticeConfiguration();
    this.closeLatticeForm();
  }
}
class BasisEditorWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this._selectors = this.getWrappedSelectors(_selectors.SELECTORS.sourceEditor.basisEditor);
  }

  // parse text from feature table to basis text in final form
  _parseTableTextToBasisString(basisTextInTable) {
    const basisLines = basisTextInTable.split(";");
    return basisLines.join("\n");
  }
  getCodeMirrorContent(editorId) {
    // eslint-disable-next-line no-shadow
    return exabrowser.execute(editorId => {
      const element = document.getElementById(editorId);
      return element.getElementsByClassName("cm-content")[0].cmView.editorView.state.doc.toString();
    }, editorId).value;
  }
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
  getBasisText() {
    return this.getCodeMirrorContent(_selectors.SELECTORS.sourceEditor.basisEditor.basisTextArea);
  }
  setBasisUnits(unitsName) {
    this.waitForMaterialInit();
    exabrowser.scrollAndClick(this._selectors.basisUnitsByName(unitsName));
  }
  setBasis(basisTextInTable) {
    const clsInstance = this;
    const basisText = this._parseTableTextToBasisString(basisTextInTable);
    clsInstance.setCodeMirrorContent(_selectors.SELECTORS.sourceEditor.basisEditor.basisTextArea, basisText);
  }
}
class SourceEditorWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this.basisEditor = new BasisEditorWidget(_selectors.SELECTORS.sourceEditor.basisEditor.wrapper);
    this.latticeEditor = new LatticeEditorWidget(_selectors.SELECTORS.sourceEditor.latticeEditor.wrapper);
  }
}
exports.SourceEditorWidget = SourceEditorWidget;