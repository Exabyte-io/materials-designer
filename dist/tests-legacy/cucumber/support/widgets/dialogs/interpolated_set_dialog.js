"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InterpolatedSetDialogWidget = void 0;
var _selectors = require("../../selectors");
var _widget = require("../../widget");
class InterpolatedSetDialogWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this.selectors = this.getWrappedSelectors(_selectors.SELECTORS.headerMenu.interpolatedSetDialog);
  }
  setInterpolatedSetImagesCount(nImages) {
    exabrowser.setValueWithBackspaceClear(this.selectors.intermediateImagesInput, nImages);
  }
  submit() {
    exabrowser.scrollAndClick(this.selectors.submitButton);
  }
}
exports.InterpolatedSetDialogWidget = InterpolatedSetDialogWidget;