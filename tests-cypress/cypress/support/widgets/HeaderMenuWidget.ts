// import { SELECTORS } from "../selectors";
// import { retry } from "../utils";
import Widget from "./Widget";

export default class HeaderMenuWidget extends Widget {
    constructor(selector: string) {
        super(selector);
        // this._selectors = this.getWrappedSelectors(SELECTORS.headerMenu);
    }

    openMenuDialog(menuName: string) {
        cy.contains(menuName).click();
    }

    selectMenuItem(menuName: string, itemNumber: number) {
        cy.contains(menuName).click();
        // retry due to animation
        // retry(
        //     () => {
        //         exabrowser.scrollAndClick(
        //             this._selectors.menuDialogItemByNumber(menuName, itemNumber),
        //         );
        //     },
        //     { retries: 5 },
        // );
    }

    // old selectMenuItemByNameAndItemNumber
    clickOnMenuItem(menuName: string, subMenuName: string) {
        this.openMenuDialog(menuName);
        this.openMenuDialog(subMenuName);
        // this.selectMenuItem(menuName, itemNumber);
    }

    /**
     * @summary Waits for the completion of any running operations: eg. save.
     */
    waitForMaterialInit() {
        // exabrowser.waitForVisible(this._selectors.checkIndicatorButton);
        // exabrowser.waitForDisappear(this._selectors.spinnerIndicatorButton);
    }
}
