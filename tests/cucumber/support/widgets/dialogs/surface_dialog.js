import { SELECTORS } from "../../selectors";
import { Widget } from "../../widget";

export class SurfaceDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.surfaceDialog);
    }

    generateSurface({
        h, k, l, thickness, vacuumRatio, vx, vy,
    }) {
        if (h) exabrowser.setValue(this.selectors.h, h);
        if (k) exabrowser.setValue(this.selectors.k, k);
        if (l) exabrowser.setValue(this.selectors.l, l);
        if (thickness) exabrowser.setValue(this.selectors.thickness, thickness);
        if (vacuumRatio) exabrowser.setValue(this.selectors.vacuumRatio, vacuumRatio);
        if (vx) exabrowser.setValue(this.selectors.vx, vx);
        if (vy) exabrowser.setValue(this.selectors.vy, vy);
    }

    submit() { exabrowser.scrollAndClick(this.selectors.submitButton); }
}
