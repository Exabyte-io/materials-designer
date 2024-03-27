"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnackbarAlertWidget = void 0;
var _logger = require("../../logger");
var _selectors = require("../../selectors");
var _utils = require("../../utils");
var _alert_widget = require("./alert_widget");
class SnackbarAlertWidget extends _alert_widget.AlertWidget {
  getAlertSelectorByType(type) {
    return this.getWrappedSelector(_selectors.SELECTORS.snackbarAlertWidget.alertByType(type), "");
  }
  isVisibleByType(type) {
    return exabrowser.isVisible(this.getAlertSelectorByType(type));
  }
  isVisibleSuccess() {
    return this.isVisibleByType("success");
  }
  close() {
    exabrowser.scrollAndClick(this.getWrappedSelector(_selectors.SELECTORS.snackbarAlertWidget.closeButton));
  }
  closeAllSuccess() {
    (0, _utils.retry)(() => {
      if (this.isVisible()) {
        this.close();
        _logger.logger.debug("Success SnackbarAlert closed");
        // eslint-disable-next-line no-throw-literal
        throw "Something is wrong: there should be no success SnackbarAlert shown!";
      }
    });
  }
}
exports.SnackbarAlertWidget = SnackbarAlertWidget;