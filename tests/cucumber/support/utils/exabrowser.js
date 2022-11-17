/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
import _ from "underscore";
import url from "url";

import { logger } from "../logger";
import { SETTINGS } from "../settings";
import { retry } from ".";

/**
 * @summary Extends webdriver.io methods.
 */
export class ExaBrowser {
    /**
     * @summary Waits for element to become visible, clickable or to exist.
     * @param selector {String} CSS selector.
     * @param nonVisible {Boolean} whether element is nonVisible.
     * @param waitForClickable {Boolean} whether to wait for the element to become clickable.
     */
    waitForVisibleClickableOrExist(selector, nonVisible = false, waitForClickable = false) {
        if (!nonVisible) {
            if (waitForClickable) {
                logger.debug(`waitForClickable: selector - ${selector}`);
                this.waitForClickable(selector, SETTINGS.RENDER_TIMEOUT);
            } else {
                logger.debug(`waitForExist: selector - ${selector}`);
                this.waitForExist(selector, SETTINGS.RENDER_TIMEOUT);
            }
        } else {
            logger.debug(`waitForExist: selector - ${selector}`);
            this.waitForExist(selector, SETTINGS.RENDER_TIMEOUT);
        }
    }

    /**
     * @summary Scrolls to the element and clicks on it.
     * @param selector {String} CSS selector.
     * @param nonVisible {Boolean} whether element is nonVisible.
     * @param xoffset {Number}
     * @param yoffset {Number}
     */
    scrollAndClick(selector, nonVisible = false, xoffset = 0, yoffset = -150) {
        this.waitForVisibleClickableOrExist(selector, nonVisible, true);
        this.safelyScroll(selector, xoffset, yoffset);
        this.click(selector);
        logger.debug(`Clicked ${selector}`);
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
            logger.debug(`unable to scroll. ${e}`);
        }
    }

    /**
     * @summary Toggles the checkbox.
     * @param selector {String} CSS selector.
     * @param reverse {Boolean} when desired checkbox state is uncheck.
     */
    toggleCheckbox(selector, reverse) {
        this.waitForVisible(selector);
        logger.debug(`Click on selector: ${selector}, is selected=${this.isSelected(selector)}`);
        if (this.isSelected(selector) === !!reverse) { // boolean type casting
            this.moveToObject(selector);
            this.click(selector);
            logger.debug(`Clicked on selector: ${selector}`);
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
            $(selector).val(value).get(0).dispatchEvent(new Event("input", { bubbles: true }));
        }, selector, value);
    }

    /**
     * @summary Overrides browser.waitForVisible to add a default timeout if not specified.
     * @param selector {String} CSS selector.
     * @param [options] {Object}
     * @param [options.ms] {Number} time in ms (default: settings.RENDER_TIMEOUT).
     * @param [options.reverse] {Boolean} if true it waits for the opposite (default: false).
     */
    waitForVisible(selector, options = {}) {
        const { ms = SETTINGS.RENDER_TIMEOUT, reverse = false } = options;
        logger.debug(`waitForVisible: selector - ${selector}, ms - ${ms}, reverse - ${reverse}`);
        browser.waitForVisible(selector, ms, reverse);
    }

    /**
     * @summary Overriding browser.waitForExist to add a default timeout if not specified.
     * @param selector {String} CSS selector.
     * @param [options] {Object}
     * @param [options.ms] {Number} time in ms (default: settings.RENDER_TIMEOUT).
     * @param [options.reverse] {Boolean} if true it waits for the opposite (default: false).
     */
    waitForExist(selector, options = {}) {
        const { ms = SETTINGS.RENDER_TIMEOUT, reverse = false } = options;
        logger.debug(`waitForVisible: selector - ${selector}, ms - ${ms}, reverse - ${reverse}`);
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
            reverse: true,
        });
    }

    /**
     * @summary Waits until one of specified selectors present/absent (depends on reverse arg).
     * @param selectors {String[]} list of CSS selectors.
     * @param [ms] {Number} time in ms (default: settings.RENDER_TIMEOUT)
     */
    waitForVisibleOneOf(selectors, ms = SETTINGS.RENDER_TIMEOUT) {
        logger.debug(`waitForVisibleOneOf: selectors - ${selectors}, ms - ${ms}`);
        retry(() => {
            const isOneVisible = _.some(selectors.map((x) => this.isVisible(x)));
            if (!isOneVisible) throw new Error(`None of ${JSON.stringify(selectors)} visible`);
        }, {
            retries: 5,
            interval: ms / 5,
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
        // eslint-disable-next-line no-useless-escape
        const root = process.env.ROOT_URL.replace(/([a-zA-Z+.\-]+):\/\/([^\/]+):([0-9]+)\//, "$1://$2/");
        return url.resolve(root, path);
    }

    urlForceLoad(path, forceLoad = false) {
        const currentURL = this.getUrl();
        logger.debug(`Current url is ${currentURL}`);
        const fullURL = this.getFullURL(path);
        if (forceLoad || fullURL !== currentURL) {
            logger.debug(`Navigating to ${fullURL}`);
            this.url(fullURL);
        } else {
            logger.debug(`Already on ${fullURL}`);
        }
    }

    clickWithRetry(selector, nonVisible, retries = 5) {
        const clsInstance = this;
        retry(() => clsInstance.click(selector, nonVisible), { retries });
    }

    clickAndWaitForAnimation(clickSelector, animationSelector, timeout = 5000) {
        // eslint-disable-next-line no-param-reassign
        animationSelector = animationSelector || clickSelector;
        this.timeoutsAsyncScript(timeout);
        this.executeAsync((clickSelector, animationSelector, done) => {
            // eslint-disable-next-line no-unused-vars
            $(clickSelector).click(() => { $(animationSelector).one("webkitTransitionEnd", (event) => done()); });
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

    elementIdElementValue(...args) {
        return browser.elementIdElement(...args).value;
    }
}

/**
 * @summary Initializes ExaBrowser.
 * NOTE: needs to be initialized inside a hook because "webdriver.browser" is not available before hooks are executed.
 */
export function initializeExaBrowserHook() {
    const exaBrowserFunctionNames = Object.getOwnPropertyNames(ExaBrowser.prototype);
    _.extend(
        ExaBrowser.prototype,
        _.pick(browser, (value, key) => !exaBrowserFunctionNames.includes(key)),
    );
    global.exabrowser = new ExaBrowser();
}
