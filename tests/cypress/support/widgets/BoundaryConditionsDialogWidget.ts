import browser from "../browser";
import Widget from "./Widget";

const selectors = {
    wrapper: "#BoundaryConditionsModal",
    submitButton: "#BoundaryConditionsModal-submit-button",
    type: '.MuiFormControl-root[data-tid="type"]',
    offset: '[data-tid="offset"] input',
};

export interface BoundaryConditions {
    type: string;
    offset: number;
}

export default class BoundaryConditionsDialogWidget extends Widget {
    selectors: typeof selectors;

    constructor() {
        super(selectors.wrapper);
        this.selectors = this.getWrappedSelectors(selectors);
    }

    addBoundaryConditions({ type, offset }: BoundaryConditions) {
        const selectorType = this.selectors.type;
        const selectorOffset = this.selectors.offset;
        browser.waitForVisible(selectorType);
        browser.click(selectorType);
        const menuItemSelector = `li[data-value="${type}"]`;
        browser.waitForVisible(menuItemSelector);
        browser.click(menuItemSelector);

        browser.waitForVisible(selectorOffset);
        browser.setInputValue(this.selectors.offset, offset);
    }

    submit() {
        browser.click(this.selectors.submitButton);
    }
}
