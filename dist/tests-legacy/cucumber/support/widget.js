"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Widget = void 0;
var _logger = require("./logger");
var _selectors = require("./selectors");
class Widget {
  constructor(selector) {
    // selector to get the widget's top-level DOM element.
    this.selector = selector;
  }
  isVisible() {
    return exabrowser.isVisible(this.selector);
  }
  waitForVisible() {
    exabrowser.waitForVisible(this.selector);
  }
  waitForDisappear() {
    exabrowser.waitForDisappear(this.selector);
  }

  /**
   * @summary Waits for the loader inside the widget to disappear.
   */
  waitForLoaderToDisappear() {
    exabrowser.waitForDisappear(this.getWrappedSelector("div.spinner"));
  }
  waitForLoaderToBeVisible(ms) {
    exabrowser.waitForVisible(this.getWrappedSelector("div.spinner"), {
      ms
    });
  }

  /**
   * Waits for the loader to become visible. Safely pass if the loader is quickly gone and is not caught.
   */
  safelyWaitForLoaderToBeVisible(ms) {
    try {
      this.waitForLoaderToBeVisible(ms);
    } catch (e) {
      _logger.logger.debug("loader is not visible. safely pass.");
    }
  }
  getWrappedSelector(selector) {
    let separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : " ";
    return "".concat(this.selector).concat(separator).concat(selector);
  }

  /**
   * @summary Wraps the selectors, including functions, passed at the top level of config object
   */
  // eslint-disable-next-line no-unused-vars
  getWrappedSelectors(config) {
    var _this = this;
    let separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : " ";
    const o = {};
    Object.keys(config).forEach(key => {
      const value = config[key];
      let newValue;
      switch (typeof value) {
        case "string":
          newValue = this.getWrappedSelector(value);
          break;
        case "function":
          newValue = function () {
            return _this.getWrappedSelector(value(...arguments));
          };
          break;
        default:
          newValue = value;
      }
      Object.assign(o, {
        [key]: newValue
      });
    });
    return o;
  }
  waitForExist() {
    exabrowser.waitForExist(this.selector);
  }

  // eslint-disable-next-line class-methods-use-this
  waitForModalBackdropDisappear() {
    exabrowser.waitForDisappear(_selectors.SELECTORS.modalBackdrop);
  }
}
exports.Widget = Widget;