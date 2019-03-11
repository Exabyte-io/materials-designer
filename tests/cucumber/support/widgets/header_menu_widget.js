import {Widget} from "../widget";
import {SELECTORS} from "../selectors";

export class HeaderMenuWidget extends Widget {
    constructor(selector) {
        super(selector);
        this._selectors = this.getWrappedSelectors(SELECTORS.materialDesignerWidget.headerMenu);
    }

    openMenuDialog(menuName) {
        exabrowser.scrollAndClick(this._selectors.menuDialogByName(menuName));
    }

    selectMenuItem(menuName, itemNumber) {
        exabrowser.scrollAndClick(this._selectors.menuDialogItemByNumber(menuName, itemNumber));
    }

    selectMenuItemByNameAndItemNumber(menuName, itemNumber) {
        this.openMenuDialog(menuName);
        this.selectMenuItem(menuName, itemNumber);
    }

    /**
     * @summary Waits for the completion of any running operations: eg. save.
     */
    waitForMaterialInit() {
        exabrowser.waitForVisible(this._selectors.checkIndicatorButton);
        exabrowser.waitForDisappear(this._selectors.spinnerIndicatorButton);
    };

}
