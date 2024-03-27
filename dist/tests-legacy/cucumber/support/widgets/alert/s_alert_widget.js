"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SAlertWidget = void 0;
var _logger = require("../../logger");
var _selectors = require("../../selectors");
var _utils = require("../../utils");
var _alert_widget = require("./alert_widget");
class SAlertWidget extends _alert_widget.AlertWidget {
  getAlertSelectorByType(type) {
    return this.getWrappedSelector(_selectors.SELECTORS.sAlertWidget.alertByType(type), "");
  }
  isVisibleByType(type) {
    return exabrowser.isVisible(this.getAlertSelectorByType(type));
  }
  isVisibleSuccess() {
    return this.isVisibleByType("success");
  }
  close() {
    exabrowser.scrollAndClick(this.getWrappedSelector(_selectors.SELECTORS.sAlertWidget.closeButton));
  }
  closeAllSuccess() {
    (0, _utils.retry)(() => {
      if (this.isVisible()) {
        _logger.logger.debug("sAlertSuccess closed");
        this.close();
        // eslint-disable-next-line no-throw-literal
        throw "Something is wrong: there should be no sAlertSuccess shown!";
      }
    });
  }
}
exports.SAlertWidget = SAlertWidget;