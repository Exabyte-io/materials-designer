import {AlertWidget} from "./alert_widget";
import {SELECTORS} from "../../../../selectors";
import {retry} from "../../../../utils";
import {logger} from "../../../../logger";

export class SAlertWidget extends AlertWidget {

    getAlertSelectorByType(type) {
        return this.getWrappedSelector(SELECTORS.sAlertWidget.alertByType(type), "")
    }

    isVisibleByType(type) {return exabrowser.isVisible(this.getAlertSelectorByType(type))}

    isVisibleSuccess() {return this.isVisibleByType("success")}

    close() {exabrowser.scrollAndClick(this.getWrappedSelector(SELECTORS.sAlertWidget.closeButton))}

    closeAllSuccess() {
        retry(() => {
            if (this.isVisible()) {
                logger.debug("sAlertSuccess closed");
                this.close();
                throw ("Something is wrong: there should be no sAlertSuccess shown!");
            }
        })
    }

}
