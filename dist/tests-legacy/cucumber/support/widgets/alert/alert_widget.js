"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertWidget = void 0;
var _widget = require("../../widget");
class AlertWidget extends _widget.Widget {
  // override upon inheritance
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  getAlertSelectorByType(type) {}

  /**
   * @summary Returns message text.
   * @return {String}
   */
  getText(type) {
    exabrowser.waitForVisible(this.getAlertSelectorByType(type));
    return exabrowser.getText(this.getAlertSelectorByType(type));
  }
}
exports.AlertWidget = AlertWidget;