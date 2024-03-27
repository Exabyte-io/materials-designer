"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SurfaceDialogWidget = void 0;
var _selectors = require("../../selectors");
var _widget = require("../../widget");
class SurfaceDialogWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this.selectors = this.getWrappedSelectors(_selectors.SELECTORS.headerMenu.surfaceDialog);
  }
  generateSurface(_ref) {
    let {
      h,
      k,
      l,
      thickness,
      vacuumRatio,
      vx,
      vy
    } = _ref;
    if (h) exabrowser.setValueWithBackspaceClear(this.selectors.h, h);
    if (k) exabrowser.setValueWithBackspaceClear(this.selectors.k, k);
    if (l) exabrowser.setValueWithBackspaceClear(this.selectors.l, l);
    if (thickness) exabrowser.setValueWithBackspaceClear(this.selectors.thickness, thickness);
    if (vacuumRatio) exabrowser.setValueWithBackspaceClear(this.selectors.vacuumRatio, vacuumRatio);
    if (vx) exabrowser.setValueWithBackspaceClear(this.selectors.vx, vx);
    if (vy) exabrowser.setValueWithBackspaceClear(this.selectors.vy, vy);
  }
  submit() {
    exabrowser.scrollAndClick(this.selectors.submitButton);
  }
}
exports.SurfaceDialogWidget = SurfaceDialogWidget;