import browser from "../browser";
import Widget from "./Widget";

const selectors = {
    wrapper: "#supercellModal",
    submitButton: "#make-supercell",
    matrixElementByIndices: (i: number, j: number) => `div.m${i + 1}${j + 1} input`,
}

export class SupercellDialogWidget extends Widget {
    selectors: typeof selectors;
    
    constructor() {
        super(selectors.wrapper);
        this.selectors = this.getWrappedSelectors(selectors);
    }

    /**
     * @param supercellMatrixAsString {String} Scaling matrix in the following format: '1 0 0, 0 1 0, 0 0 1'
     */
    generateSupercell(supercellMatrixAsString: string) {
        const scalingMatrix = supercellMatrixAsString
            .split(",")
            .map((row) => row.trim().split(" ").map(parseFloat));
        scalingMatrix.forEach((scalingVector, i) => {
            scalingVector.forEach((scalingNumber, j) => {
                browser.setInputValue(
                    this.selectors.matrixElementByIndices(i, j),
                    scalingNumber,
                );
            });
        });
    }

    submit() {
        browser.click(this.selectors.submitButton);
    }
}
