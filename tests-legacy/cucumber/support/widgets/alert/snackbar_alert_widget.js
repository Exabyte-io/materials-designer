import { logger } from "../../logger";
import { SELECTORS } from "../../selectors";
import { retry } from "../../utils";
import { AlertWidget } from "./alert_widget";

export class SnackbarAlertWidget extends AlertWidget {
    getAlertSelectorByType(type) {
        return this.getWrappedSelector(SELECTORS.snackbarAlertWidget.alertByType(type), "");
    }

    isVisibleByType(type) {
        return exabrowser.isVisible(this.getAlertSelectorByType(type));
    }

    isVisibleSuccess() {
        return this.isVisibleByType("success");
    }

    close() {
        exabrowser.scrollAndClick(
            this.getWrappedSelector(SELECTORS.snackbarAlertWidget.closeButton),
        );
    }

    closeAllSuccess() {
        retry(() => {
            if (this.isVisible()) {
                this.close();
                logger.debug("Success SnackbarAlert closed");
                // eslint-disable-next-line no-throw-literal
                throw "Something is wrong: there should be no success SnackbarAlert shown!";
            }
        });
    }
}
