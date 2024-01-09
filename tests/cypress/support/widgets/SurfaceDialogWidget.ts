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

const selectors = {
    wrapper: "#surfaceModal",
    submitButton: "#surfaceModal-submit-button",
    h: '[data-tid="miller-h"] input',
    k: '[data-tid="miller-k"] input',
    l: '[data-tid="miller-l"] input',
    thickness: '[data-tid="thickness"] input',
    vacuumRatio: '[data-tid="vacuum-ratio"] input',
    vx: '[data-tid="vx"] input',
    vy: '[data-tid="vy"] input',
};

export default class SurfaceDialogWidget extends Widget {
    selectors: typeof selectors;

    constructor() {
        super(selectors.wrapper);
        this.selectors = this.getWrappedSelectors(selectors);
    }

    generateSurface({ h, k, l, thickness, vacuumRatio, vx, vy }: SurfaceConfig) {
        if (h) this.browser.setInputValue(this.selectors.h, h);
        if (k) this.browser.setInputValue(this.selectors.k, k);
        if (l) this.browser.setInputValue(this.selectors.l, l);
        if (thickness) this.browser.setInputValue(this.selectors.thickness, thickness);
        if (vacuumRatio) this.browser.setInputValue(this.selectors.vacuumRatio, vacuumRatio);
        if (vx) this.browser.setInputValue(this.selectors.vx, vx);
        if (vy) this.browser.setInputValue(this.selectors.vy, vy);
    }

    submit() {
        this.browser.click(this.selectors.submitButton);
    }
}
