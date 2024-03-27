"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExaBrowser = void 0;
exports.initializeExaBrowserHook = initializeExaBrowserHook;
var _underscore = _interopRequireDefault(require("underscore"));
var _url = _interopRequireDefault(require("url"));
var _logger = require("../logger");
var _settings = require("../settings");
var _2 = require(".");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */

/**
 * @summary Extends webdriver.io methods.
 */
class ExaBrowser {
  /**
   * @summary Waits for element to become visible, clickable or to exist.
   * @param selector {String} CSS selector.
   * @param nonVisible {Boolean} whether element is nonVisible.
   * @param waitForClickable {Boolean} whether to wait for the element to become clickable.
   */
  waitForVisibleClickableOrExist(selector) {
    let nonVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let waitForClickable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (!nonVisible) {
      if (waitForClickable) {
        _logger.logger.debug("waitForClickable: selector - ".concat(selector));
        this.waitForClickable(selector, _settings.SETTINGS.RENDER_TIMEOUT);
      } else {
        _logger.logger.debug("waitForExist: selector - ".concat(selector));
        this.waitForExist(selector, _settings.SETTINGS.RENDER_TIMEOUT);
      }
    } else {
      _logger.logger.debug("waitForExist: selector - ".concat(selector));
      this.waitForExist(selector, _settings.SETTINGS.RENDER_TIMEOUT);
    }
  }

  /**
   * @summary Scrolls to the element and clicks on it.
   * @param selector {String} CSS selector.
   * @param nonVisible {Boolean} whether element is nonVisible.
   * @param xoffset {Number}
   * @param yoffset {Number}
   */
  scrollAndClick(selector) {
    let nonVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let xoffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    let yoffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -150;
    this.waitForVisibleClickableOrExist(selector, nonVisible, true);
    this.safelyScroll(selector, xoffset, yoffset);
    this.click(selector);
    _logger.logger.debug("Clicked ".concat(selector));
  }

  /**
   * Scrolls to the given element. Errors are safely caught.
   * In some cases where the element position is changed due to animation or re-rendering the element is clickable but
   * `TypeError: Cannot read property 'x' of null` is thrown, hence this function to safely handle it.
   */
  safelyScroll(selector, xoffset, yoffset) {
    try {
      this.scroll(selector, xoffset, yoffset);
    } catch (e) {
      _logger.logger.debug("unable to scroll. ".concat(e));
    }
  }

  /**
   * @summary Toggles the checkbox.
   * @param selector {String} CSS selector.
   * @param reverse {Boolean} when desired checkbox state is uncheck.
   */
  toggleCheckbox(selector, reverse) {
    this.waitForVisible(selector);
    _logger.logger.debug("Click on selector: ".concat(selector, ", is selected=").concat(this.isSelected(selector)));
    if (this.isSelected(selector) === !!reverse) {
      // boolean type casting
      this.moveToObject(selector);
      this.click(selector);
      _logger.logger.debug("Clicked on selector: ".concat(selector));
    }
  }

  /**
   * @summary Selects option with displayed text matching the argument.
   */
  waitForVisibleAndSelectByVisibleText(selector, text) {
    this.waitForVisible(selector);
    this.selectByVisibleText(selector, text);
  }

  /**
   * @summary Waits for the element to become visible or to exist and then sets the value.
   * @param selector {String} CSS selector.
   * @param values {String} text value.
   * @param nonVisible {Boolean} whether element is nonVisible.
   */
  waitForVisibleOrExistAndSetValue(selector, values, nonVisible) {
    this.waitForVisibleClickableOrExist(selector, nonVisible);
    this.setValue(selector, values);
  }

  /**
   * @summary Uses JQuery to set the value.
   * @param selector {String} CSS selector.
   * @param value {String} the string value to set the element to.
   * @param [nonVisible] {boolean} if visible wait to appear, if not wait to be rendered.
   */
  setValueWithJQuery(selector, value, nonVisible) {
    this.waitForVisibleClickableOrExist(selector, nonVisible);
    this.execute((selector, value) => {
      // setting the value onto element and dispatching input
      // event should trigger React's change event
      $(selector).val(value).get(0).dispatchEvent(new Event("input", {
        bubbles: true
      }));
    }, selector, value);
  }

  /**
   * @summary Overrides browser.waitForVisible to add a default timeout if not specified.
   * @param selector {String} CSS selector.
   * @param [options] {Object}
   * @param [options.ms] {Number} time in ms (default: settings.RENDER_TIMEOUT).
   * @param [options.reverse] {Boolean} if true it waits for the opposite (default: false).
   */
  waitForVisible(selector) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const {
      ms = _settings.SETTINGS.RENDER_TIMEOUT,
      reverse = false
    } = options;
    _logger.logger.debug("waitForVisible: selector - ".concat(selector, ", ms - ").concat(ms, ", reverse - ").concat(reverse));
    browser.waitForVisible(selector, ms, reverse);
  }

  /**
   * @summary Overriding browser.waitForExist to add a default timeout if not specified.
   * @param selector {String} CSS selector.
   * @param [options] {Object}
   * @param [options.ms] {Number} time in ms (default: settings.RENDER_TIMEOUT).
   * @param [options.reverse] {Boolean} if true it waits for the opposite (default: false).
   */
  waitForExist(selector) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const {
      ms = _settings.SETTINGS.RENDER_TIMEOUT,
      reverse = false
    } = options;
    _logger.logger.debug("waitForVisible: selector - ".concat(selector, ", ms - ").concat(ms, ", reverse - ").concat(reverse));
    browser.waitForExist(selector, ms, reverse);
  }

  /**
   * @summary Wait for element to disappear.
   * @param selector {String} CSS selector.
   * @param [ms] {Number} time in ms (default: settings.RENDER_TIMEOUT).
   */
  waitForDisappear(selector, ms) {
    this.waitForVisible(selector, {
      ms,
      reverse: true
    });
  }

  /**
   * @summary Waits until one of specified selectors present/absent (depends on reverse arg).
   * @param selectors {String[]} list of CSS selectors.
   * @param [ms] {Number} time in ms (default: settings.RENDER_TIMEOUT)
   */
  waitForVisibleOneOf(selectors) {
    let ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _settings.SETTINGS.RENDER_TIMEOUT;
    _logger.logger.debug("waitForVisibleOneOf: selectors - ".concat(selectors, ", ms - ").concat(ms));
    (0, _2.retry)(() => {
      const isOneVisible = _underscore.default.some(selectors.map(x => this.isVisible(x)));
      if (!isOneVisible) throw new Error("None of ".concat(JSON.stringify(selectors), " visible"));
    }, {
      retries: 5,
      interval: ms / 5
    });
  }

  /**
   * @summary Waits until element is clickable.
   * See https://github.com/webdriverio/webdriverio/issues/1145#issuecomment-192645162
   * @param selector {String} CSS selector.
   * @param ms {Number} time in ms (default: settings.RENDER_TIMEOUT)
   */
  waitForClickable(selector, ms) {
    this.waitForVisible(selector, ms);
    this.waitForEnabled(selector, ms);
  }
  getFullURL(path) {
    const root = process.env.ROOT_URL.replace(
    // eslint-disable-next-line no-useless-escape
    /([a-zA-Z+.\-]+):\/\/([^\/]+):([0-9]+)\//, "$1://$2/");
    return _url.default.resolve(root, path);
  }
  urlForceLoad(path) {
    let forceLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const currentURL = this.getUrl();
    _logger.logger.debug("Current url is ".concat(currentURL));
    const fullURL = this.getFullURL(path);
    if (forceLoad || fullURL !== currentURL) {
      _logger.logger.debug("Navigating to ".concat(fullURL));
      this.url(fullURL);
    } else {
      _logger.logger.debug("Already on ".concat(fullURL));
    }
  }
  clickWithRetry(selector, nonVisible) {
    let retries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
    const clsInstance = this;
    (0, _2.retry)(() => clsInstance.click(selector, nonVisible), {
      retries
    });
  }
  clickAndWaitForAnimation(clickSelector, animationSelector) {
    let timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5000;
    // eslint-disable-next-line no-param-reassign
    animationSelector = animationSelector || clickSelector;
    this.timeoutsAsyncScript(timeout);
    this.executeAsync((clickSelector, animationSelector, done) => {
      $(clickSelector).click(() => {
        // eslint-disable-next-line no-unused-vars
        $(animationSelector).one("webkitTransitionEnd", event => done());
      });
      $(clickSelector).trigger("click");
    }, clickSelector, animationSelector);
  }

  /**
   * @summary Clear the field, and then set its value
   * see: https://github.com/webdriverio/webdriverio/issues/1140#issuecomment-449027183
   * @param selector {String} CSS selector for the field in question
   * @param value {String} The final value to be left in the field
   */
  setValueWithBackspaceClear(selector, value) {
    const existingValueLength = this.getValue(selector).length;
    const backspaceArray = new Array(existingValueLength).fill("Backspace");
    this.setValue(selector, backspaceArray);
    this.setValue(selector, value);
  }
  elementIdElementValue() {
    return browser.elementIdElement(...arguments).value;
  }

  /**
   * @summary Explicitly clear the file selector field before choosing the file for upload.
   *
   * What's happening here is that WebDriver seems to have changed behavior to follow a W3C specification, and has
   * strange behavior around not clearing out a field when setting a new value.  Because the field here is hidden, we
   * can't use the Backspace trick like we did above with setValueWithBackspaceClear().  Instead, we can force the
   * field blank with some javascript.
   * For example: https://github.com/webdriverio/webdriverio/issues/3024#issuecomment-444438972
   */
  chooseFileWithClear(selector, filePath) {
    this.execute("document.querySelector('".concat(selector, "').value='';"));
    this.chooseFile(selector, filePath);
  }
}

/**
 * @summary Initializes ExaBrowser.
 * NOTE: needs to be initialized inside a hook because "webdriver.browser" is not available before hooks are executed.
 */
exports.ExaBrowser = ExaBrowser;
function initializeExaBrowserHook() {
  const exaBrowserFunctionNames = Object.getOwnPropertyNames(ExaBrowser.prototype);
  _underscore.default.extend(ExaBrowser.prototype, _underscore.default.pick(browser, (value, key) => !exaBrowserFunctionNames.includes(key)));
  global.exabrowser = new ExaBrowser();
}