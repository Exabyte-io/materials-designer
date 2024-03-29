import { Widget } from "../../widget";

export class AlertWidget extends Widget {
    // override upon inheritance
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    getAlertSelectorByType(type) {}

    /**
     * @summary Returns message text.
     * @return {String}
     */
    getText(type) {
        exabrowser.waitForVisible(this.getAlertSelectorByType(type));
        return exabrowser.getText(this.getAlertSelectorByType(type));
    }
}
