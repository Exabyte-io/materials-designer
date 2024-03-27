"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SupercellDialogWidget = void 0;
var _selectors = require("../../selectors");
var _widget = require("../../widget");
class SupercellDialogWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this._selectors = this.getWrappedSelectors(_selectors.SELECTORS.headerMenu.supercellDialog);
  }

  /**
   * @param supercellMatrixAsString {String} Scaling matrix in the following format: '1 0 0, 0 1 0, 0 0 1'
   */
  generateSupercell(supercellMatrixAsString) {
    const scalingMatrix = supercellMatrixAsString.split(",").map(row => row.trim().split(" ").map(parseFloat));
    scalingMatrix.forEach((scalingVector, i) => {
      scalingVector.forEach((scalingNumber, j) => {
        exabrowser.setValueWithBackspaceClear(this._selectors.matrixElementByIndices(i, j), scalingNumber);
      });
    });
  }
  submit() {
    exabrowser.scrollAndClick(this._selectors.submitButton);
    exabrowser.waitForClickable(_selectors.SELECTORS.headerMenu.wrapper, 500);
  }
}
exports.SupercellDialogWidget = SupercellDialogWidget;