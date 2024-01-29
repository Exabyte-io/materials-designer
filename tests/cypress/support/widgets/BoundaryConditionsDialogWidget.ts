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
        this.browser.waitForVisible(selectorType);
        this.browser.click(selectorType);
        const menuItemSelector = `li[data-value="${type}"]`;
        this.browser.waitForVisible(menuItemSelector);
        this.browser.click(menuItemSelector);

        this.browser.waitForVisible(selectorOffset);
        this.browser.setInputValue(this.selectors.offset, offset);
    }

    submit() {
        this.browser.click(this.selectors.submitButton);
    }
}
