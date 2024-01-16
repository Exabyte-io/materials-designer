import Widget from "./Widget";

const selectors = {
    wrapper: "#standata-import-dialog",
    dialog: "div[role='dialog']",
    materialsSelector: "[data-tid='materials-selector']",
    materialsSelectorItem: (materialName: string) =>
        `li[data-tid='select-material']:contains("${materialName}")`,
    submitButton: "#standata-import-dialog-submit-button",
};
export default class StandataDialogWidget extends Widget {
    wrappedSelectors: typeof selectors;

    constructor() {
        super(selectors.wrapper);
        this.wrappedSelectors = this.getWrappedSelectors(selectors);
    }

    verifyStandataDialog() {
        this.browser.waitForVisible(this.wrappedSelectors.dialog);
    }

    selectMaterial(materialName: string) {
        this.browser.click(this.wrappedSelectors.materialsSelector);
        const materialSelector = selectors.materialsSelectorItem(materialName);
        this.browser.click(materialSelector);
    }

    submit() {
        this.browser.click(selectors.submitButton);
    }
}
