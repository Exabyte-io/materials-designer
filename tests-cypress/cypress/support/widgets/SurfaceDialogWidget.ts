// import { SELECTORS } from "../../selectors";
import Widget from "./Widget";

export interface SurfaceConfig { 
    h?: number; 
    k?: number; 
    l?: number; 
    thickness?: number; 
    vacuumRatio?: number; 
    vx?: number;
    vy?: number; 
}

export default class SurfaceDialogWidget extends Widget {
    constructor(selector: string) {
        super(selector);
        // this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.surfaceDialog);
    }

    generateSurface({ h, k, l, thickness, vacuumRatio, vx, vy }: SurfaceConfig) {
        // if (h) exabrowser.setValue(this.selectors.h, h);
        // if (k) exabrowser.setValue(this.selectors.k, k);
        // if (l) exabrowser.setValue(this.selectors.l, l);
        // if (thickness) exabrowser.setValue(this.selectors.thickness, thickness);
        // if (vacuumRatio) exabrowser.setValue(this.selectors.vacuumRatio, vacuumRatio);
        // if (vx) exabrowser.setValue(this.selectors.vx, vx);
        // if (vy) exabrowser.setValue(this.selectors.vy, vy);
    }

    submit() {
        // exabrowser.scrollAndClick(this.selectors.submitButton);
    }
}
