import {Widget} from "../../widget";
import {SELECTORS} from "../../selectors";

export class InterpolatedSetDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.interpolatedSetDialog);
    }

    setInterpolatedSetImagesCount(nImages) {
        exabrowser.setValue(this.selectors.intermediateImagesInput, nImages);
    };

    submit() {exabrowser.scrollAndClick(this.selectors.submitButton);}

}
