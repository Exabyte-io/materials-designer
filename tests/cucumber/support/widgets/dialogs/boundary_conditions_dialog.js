import {Widget} from "../../widget";
import {SELECTORS} from "../../selectors";

export class BoundaryConditionsDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.boundaryConditionsDialog);
    }

    addBoundaryConditions({type, offset}) {
        exabrowser.selectByValue(this.selectors.type, type);
        exabrowser.setValue(this.selectors.offset, offset);
    };

    submit() {exabrowser.scrollAndClick(this.selectors.submitButton);}

}
