"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Page = void 0;
var _widget = require("./widget");
/**
 * http://webdriver.io/guide/testrunner/pageobjects.html.
 */
class Page extends _widget.Widget {
  /**
   * @summary Opens the page.
   */
  open(path) {
    let forceLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    exabrowser.urlForceLoad(path, forceLoad);
    this.waitForVisible();
    this.waitForLoaderToDisappear();
  }

  // eslint-disable-next-line class-methods-use-this
  getUrl() {
    return exabrowser.getUrl();
  }
}
exports.Page = Page;