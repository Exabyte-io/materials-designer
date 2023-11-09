import { SELECTORS } from "../../selectors";
import { Widget } from "../../widget";

export class SupercellDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this._selectors = this.getWrappedSelectors(SELECTORS.headerMenu.supercellDialog);
    }

    /**
     * @param supercellMatrixAsString {String} Scaling matrix in the following format: '1 0 0, 0 1 0, 0 0 1'
     */
    generateSupercell(supercellMatrixAsString) {
        const scalingMatrix = supercellMatrixAsString
            .split(",")
            .map((row) => row.trim().split(" ").map(parseFloat));
        scalingMatrix.forEach((scalingVector, i) => {
            scalingVector.forEach((scalingNumber, j) => {
                exabrowser.setValueWithBackspaceClear(
                    this._selectors.matrixElementByIndices(i, j),
                    scalingNumber,
                );
            });
        });
    }

    submit() {
        exabrowser.scrollAndClick(this._selectors.submitButton);
        exabrowser.waitForDisappear(this._selectors.wrapper);
    }
}
