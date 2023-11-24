import { SELECTORS } from "../../selectors";
import { Widget } from "../../widget";

export class SurfaceDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.surfaceDialog);
    }

    generateSurface({ h, k, l, thickness, vacuumRatio, vx, vy }) {
        if (h) exabrowser.setValueWithBackspaceClear(this.selectors.h, h);
        if (k) exabrowser.setValueWithBackspaceClear(this.selectors.k, k);
        if (l) exabrowser.setValueWithBackspaceClear(this.selectors.l, l);
        if (thickness) exabrowser.setValueWithBackspaceClear(this.selectors.thickness, thickness);
        if (vacuumRatio)
            exabrowser.setValueWithBackspaceClear(this.selectors.vacuumRatio, vacuumRatio);
        if (vx) exabrowser.setValueWithBackspaceClear(this.selectors.vx, vx);
        if (vy) exabrowser.setValueWithBackspaceClear(this.selectors.vy, vy);
    }

    submit() {
        exabrowser.scrollAndClick(this.selectors.submitButton);
    }
}
