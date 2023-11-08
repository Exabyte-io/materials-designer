import { SELECTORS } from "../../selectors";
import { Widget } from "../../widget";

export class BoundaryConditionsDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.boundaryConditionsDialog);
    }

    addBoundaryConditions({ type, offset }) {
        exabrowser.selectByValue(this.selectors.type, type);
        exabrowser.setValueWithBackspaceClear(this.selectors.offset, offset);
    }

    submit() {
        exabrowser.scrollAndClick(this.selectors.submitButton);
    }
}
