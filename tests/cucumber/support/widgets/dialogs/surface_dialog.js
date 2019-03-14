import {Widget} from "../../widget";
import {SELECTORS} from "../../selectors";

export class SurfaceDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.surfaceDialog);
    }

    generateSurface({h, k, l, thickness, vacuumRatio, vx, vy}) {
        h && exabrowser.setValue(this.selectors.h, h);
        k && exabrowser.setValue(this.selectors.k, k);
        l && exabrowser.setValue(this.selectors.l, l);
        thickness && exabrowser.setValue(this.selectors.thickness, thickness);
        vacuumRatio && exabrowser.setValue(this.selectors.vacuumRatio, vacuumRatio);
        vx && exabrowser.setValue(this.selectors.vx, vx);
        vy && exabrowser.setValue(this.selectors.vy, vy);
    };

    submit() {exabrowser.scrollAndClick(this.selectors.submitButton);}

}
