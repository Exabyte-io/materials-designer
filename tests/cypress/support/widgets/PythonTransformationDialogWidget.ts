import browser from "../browser";
import Widget from "./Widget";

const selectors = {
    wrapper: "#python-transformation-dialog",
    dialog: 'div[role="dialog"]',
    materialsSelector: "[data-tid='materials-selector']",
    materialsSelectorItem: (index: number) => `[data-tid='select-material']:nth-of-type(${index})`,
    transformationSelector: "[data-tid='transformation-selector']",
    transformationSelectorItem: (title: string) => `//li[contains(text(), '${title}')]`,
    codeInput: (id = 0) => `python-code-input-${id}`,
    pythonOutput: (id = 0) => `python-output-${id}`,
    clearOutputButton: (id = 0) => `#clear-output-${id}`,
    runButton: `.run-button`,
    submitButton: `#python-transformation-dialog-submit-button`,
    cancelButton: `#python-transformation-dialog-cancel-button`,
};

export default class PythonTransformationDialogWidget extends Widget {
    selectors: typeof selectors;

    constructor() {
        super(selectors.wrapper);
        this.selectors = this.getWrappedSelectors(selectors);
    }

    selectMaterial(index: number) {
        browser.click(this.selectors.materialsSelectorItem(index));
    }

    selectTransformation(title: string) {
        browser.click(this.selectors.transformationSelectorItem(title));
    }

    setCode(code: string, id = 0) {
        browser.setValue(this.selectors.codeInput(id), code);
    }

    getCode(id = 0) {
        return browser.getValue(this.selectors.codeInput(id));
    }

    getPythonOutput(id = 0) {
        return browser.getText(this.selectors.pythonOutput(id));
    }

    clearOutput(id = 0) {
        browser.click(this.selectors.clearOutputButton(id));
    }

    runCode(id = 0) {
        browser.click(this.selectors.runButton);
        browser.waitForVisible(this.selectors.pythonOutput(id));
    }
}
