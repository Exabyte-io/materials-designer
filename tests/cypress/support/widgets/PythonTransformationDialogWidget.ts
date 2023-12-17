import browser from "../browser";
import Widget from "./Widget";

const selectors = {
    wrapper: "#python-transformation-dialog",
    dialog: 'div[role="dialog"]',
    materialsSelector: "[data-tid='materials-selector']",
    materialsSelectorItem: (index: number) => `[data-tid='select-material']:nth-of-type(${index})`,
    transformationSelector: "[data-tid='transformation-selector']",
    transformationSelectorItem: (title: string) => `li:contains("${title}")`,
    codeInput: (id = 0) => `#python-code-input-${id}`,
    pythonOutput: (id = 0) => `#python-output-${id}`,
    clearOutputButton: (id = 0) => `#clear-output-${id}`,
    runButton: `#run-button-all`,
    submitButton: `#python-transformation-dialog-submit-button`,
    cancelButton: `#python-transformation-dialog-cancel-button`,
};

export default class PythonTransformationDialogWidget extends Widget {
    wrappedSelectors: typeof selectors;

    constructor() {
        super(selectors.wrapper);
        this.wrappedSelectors = this.getWrappedSelectors(selectors);
    }

    selectMaterial(index: number) {
        browser.click(this.wrappedSelectors.materialsSelectorItem(index));
    }

    selectTransformationByTitle(title: string) {
        browser.click(this.wrappedSelectors.transformationSelector);
        browser.click(selectors.transformationSelectorItem(title));
    }

    setCode(code: string, id = 0) {
        browser.setInputValue(selectors.codeInput(id), code);
    }

    getCode(id = 0) {
        return browser.execute((win) => {
            const element = win.document.getElementById(selectors.pythonOutput(id));
            return element
                ?.getElementsByClassName("cm-content")[0]
                .cmView.editorView.state.doc.toString();
        });
    }

    getPythonOutput(id = 0) {
        return browser.geInputValue(selectors.pythonOutput(id));
    }

    clearOutput(id = 0) {
        browser.click(this.wrappedSelectors.clearOutputButton(id));
    }

    runCode(id = 0) {
        browser.click(this.wrappedSelectors.runButton);
        browser.waitForVisible(this.wrappedSelectors.pythonOutput(id));
    }
}
