import { SELECTORS } from "../selectors";
import { Widget } from "../widget";

export class PythonTransformationDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.pythonTransformationDialog);
    }

    submit() {
        exabrowser.scrollAndClick(this.selectors.submitButton);
    }

    cancel() {
        exabrowser.scrollAndClick(this.selectors.cancelButton);
    }
}
