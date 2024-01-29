import Widget from "./Widget";

const selectors = {
    wrapper: "#interpolatedSetModal",
    submitButton: "#interpolatedSetModal-submit-button",
    intermediateImagesInput: "input[type='number']",
};

export class InterpolatedSetDialogWidget extends Widget {
    selectors: typeof selectors;

    constructor() {
        super(selectors.wrapper);
        this.selectors = this.getWrappedSelectors(selectors);
    }

    setInterpolatedSetImagesCount(nImages: number) {
        this.browser.setInputValue(this.selectors.intermediateImagesInput, nImages);
    }

    submit() {
        this.browser.click(this.selectors.submitButton);
    }
}
