"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderMenuWidget = void 0;
var _selectors = require("../selectors");
var _utils = require("../utils");
var _widget = require("../widget");
class HeaderMenuWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this._selectors = this.getWrappedSelectors(_selectors.SELECTORS.headerMenu);
  }
  openMenuDialog(menuName) {
    exabrowser.scrollAndClick(this._selectors.menuDialogByName(menuName));
  }

  // eslint-disable-next-line class-methods-use-this
  selectMenuItem(menuName, itemNumber) {
    // retry due to animation
    (0, _utils.retry)(() => {
      exabrowser.scrollAndClick(_selectors.SELECTORS.headerMenu.menuDialogItemByNumber(menuName, itemNumber));
    }, {
      retries: 5
    });
  }
  selectMenuItemByNameAndItemNumber(menuName, itemNumber) {
    this.openMenuDialog(menuName);
    this.selectMenuItem(menuName, itemNumber);
  }

  /**
   * @summary Waits for the completion of any running operations: eg. save.
   */
  waitForMaterialInit() {
    exabrowser.waitForVisible(this._selectors.checkIndicatorButton);
    exabrowser.waitForDisappear(this._selectors.spinnerIndicatorButton);
  }
}
exports.HeaderMenuWidget = HeaderMenuWidget;