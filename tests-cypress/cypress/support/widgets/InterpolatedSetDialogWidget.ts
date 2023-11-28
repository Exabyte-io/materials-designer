import browser from "../browser";
import Widget from "./Widget";

const selectors = {
    wrapper: "#interpolatedSetModal",
    submitButton: "#generate-interpolated-set",
    intermediateImagesInput: "input[type='number']",
};

export class InterpolatedSetDialogWidget extends Widget {
    selectors: typeof selectors;

    constructor() {
        super(selectors.wrapper);
        this.selectors = this.getWrappedSelectors(selectors);
    }

    setInterpolatedSetImagesCount(nImages: number) {
        browser.setInputValue(this.selectors.intermediateImagesInput, nImages);
    }

    submit() {
        browser.click(this.selectors.submitButton);
    }
}
