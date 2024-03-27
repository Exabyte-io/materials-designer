"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoundaryConditionsDialogWidget = void 0;
var _selectors = require("../../selectors");
var _widget = require("../../widget");
class BoundaryConditionsDialogWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this.selectors = this.getWrappedSelectors(_selectors.SELECTORS.headerMenu.boundaryConditionsDialog);
  }
  addBoundaryConditions(_ref) {
    let {
      type,
      offset
    } = _ref;
    const selectorType = this.selectors.type;
    const selectorOffset = this.selectors.offset;
    exabrowser.waitForVisible(selectorType);
    exabrowser.click(selectorType);
    const menuItemSelector = "li[data-value=\"".concat(type, "\"]");
    exabrowser.waitForVisible(menuItemSelector);
    exabrowser.click(menuItemSelector);
    exabrowser.waitForVisible(selectorOffset);
    exabrowser.setValueWithBackspaceClear(this.selectors.offset, offset);
  }
  submit() {
    exabrowser.scrollAndClick(this.selectors.submitButton);
  }
}
exports.BoundaryConditionsDialogWidget = BoundaryConditionsDialogWidget;