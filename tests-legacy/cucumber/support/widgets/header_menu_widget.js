import { SELECTORS } from "../selectors";
import { retry } from "../utils";
import { Widget } from "../widget";

export class HeaderMenuWidget extends Widget {
    constructor(selector) {
        super(selector);
        this._selectors = this.getWrappedSelectors(SELECTORS.headerMenu);
    }

    openMenuDialog(menuName) {
        exabrowser.scrollAndClick(this._selectors.menuDialogByName(menuName));
    }

    // eslint-disable-next-line class-methods-use-this
    selectMenuItem(menuName, itemNumber) {
        // retry due to animation
        retry(
            () => {
                exabrowser.scrollAndClick(
                    SELECTORS.headerMenu.menuDialogItemByNumber(menuName, itemNumber),
                );
            },
            { retries: 5 },
        );
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
    }
}
