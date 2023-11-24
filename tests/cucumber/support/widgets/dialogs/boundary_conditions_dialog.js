import { SELECTORS } from "../../selectors";
import { Widget } from "../../widget";

export class BoundaryConditionsDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.boundaryConditionsDialog);
    }

    addBoundaryConditions({ type, offset }) {
        const selectorType = this.selectors.type;
        const selectorOffset = this.selectors.offset;
        exabrowser.waitForVisible(selectorType);
        exabrowser.click(selectorType);
        const menuItemSelector = `li[data-value="${type}"]`;
        exabrowser.waitForVisible(menuItemSelector);
        exabrowser.click(menuItemSelector);

        exabrowser.waitForVisible(selectorOffset);
        exabrowser.setValueWithBackspaceClear(this.selectors.offset, offset);
    }

    submit() {
        exabrowser.scrollAndClick(this.selectors.submitButton);
    }
}
