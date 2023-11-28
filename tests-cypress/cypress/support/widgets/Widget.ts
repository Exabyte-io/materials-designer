

import browser from "../browser";

const modalBackdrop = ".modal-backdrop.fade"

export default class Widget {
    selector: string;

    constructor(selector: string) {
        this.selector = selector;
    }

    isVisible() {
        return browser.isVisible(this.selector);
    }

    waitForVisible() {
        return browser.waitForVisible(this.selector);
    }

    waitForDisappear() {
        return browser.waitForDisappear(this.selector);
    }

    waitForLoaderToDisappear() {
        return browser.waitForDisappear(this.getWrappedSelector("div.spinner"));
    }

    getWrappedSelector(selector: string, separator = " ") {
        return `${this.selector}${separator}${selector}`;
    }

    /**
     * @summary Wraps the selectors, including functions, passed at the top level of config object
     */
    getWrappedSelectors<T extends object = object>(config: T): T {
        const o = {};
        Object.keys(config).forEach((key) => {
            const value = config[key];
            let newValue;
            switch (typeof value) {
                case "string":
                    newValue = this.getWrappedSelector(value);
                    break;
                case "function":
                    newValue = (...args) => this.getWrappedSelector(value(...args));
                    break;
                default:
                    newValue = value;
            }
            Object.assign(o, { [key]: newValue });
        });
        return o;
    }

    // eslint-disable-next-line class-methods-use-this
    waitForModalBackdropDisappear() {
        browser.waitForDisappear(modalBackdrop);
    }
}
