import assert from "assert";
import {retry} from "../utils";
import {Widget} from "../widget";
import {SELECTORS} from "../selectors";

class LatticeEditorWidget extends Widget {
    constructor(selector) {
        super(selector);
        this._selectors = this.getWrappedSelectors(SELECTORS.sourceEditor.latticeEditor);
    }

    openLatticeForm() {
        exabrowser.scrollAndClick(this._selectors.latticeFormTrigger);
        exabrowser.waitForVisible(this._selectors.latticeFormBody);
    }

    closeLatticeForm() {
        exabrowser.scrollAndClick(this._selectors.latticeFormTrigger);
        exabrowser.waitForDisappear(this._selectors.latticeFormBody);
    }

    updateLatticeConfiguration() {
        exabrowser.scrollAndClick(this._selectors.latticeFormSaveButton)
    }

    getLattice() {
        // TBA
    };

    setLatticeParamInput(name, value) {
        exabrowser.waitForVisible(this._selectors.latticeOptionSelectorByNameInput(name));
        exabrowser.setValue(this._selectors.latticeOptionSelectorByNameInput(name), value);
    };

    setLatticeParamSelect(name, value) {
        const latticeOptionSelector = this._selectors.latticeOptionSelectorByNameSelect(name)
        exabrowser.waitForVisible(latticeOptionSelector);
        // TODO: find the reason for unreliable selectByValue and remove browser.pause
        // 'selectByValue` could be buggy: https://github.com/webdriverio/webdriverio/issues/1689
        exabrowser.pause(1000);
        exabrowser.selectByValue(latticeOptionSelector, value);
    };

    setLattice(latticeObject) {
        this.openLatticeForm();
        Object.keys(latticeObject).forEach(key => {
            const value = latticeObject[key];
            (key === 'type') ? this.setLatticeParamSelect(key, value) : this.setLatticeParamInput(key, value);
        });
        this.updateLatticeConfiguration();
        this.closeLatticeForm();
    };

}

class BasisEditorWidget extends Widget {
    constructor(selector) {
        super(selector);
        this._selectors = this.getWrappedSelectors(SELECTORS.sourceEditor.basisEditor);
    }

    // parse text from feature table to basis text in final form
    _parseTableTextToBasisString(basisTextInTable) {
        const basisLines = basisTextInTable.split(';');
        return basisLines.join("\n");

    }

    getBasisText() {
        exabrowser.waitForVisible(this._selectors.basisTextArea);
        return exabrowser.getValue(this._selectors.basisTextArea);
    };

    setBasisUnits(unitsName) {
        this.waitForMaterialInit();
        exabrowser.scrollAndClick(this._selectors.basisUnitsByName(unitsName));
    }

    setBasis(basisTextInTable) {
        const basisText = this._parseTableTextToBasisString(basisTextInTable);
        exabrowser.waitForVisible(this._selectors.basisTextArea);
        // TODO: retry functionality is legacy, find out how to avoid
        retry(() => {
            exabrowser.setValue(this._selectors.basisTextArea, basisText);
            assert.equal(this.getBasisText(), basisText);
        });
    }
}

export class SourceEditorWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.basisEditor = new BasisEditorWidget(SELECTORS.sourceEditor.basisEditor.wrapper);
        this.latticeEditor = new LatticeEditorWidget(SELECTORS.sourceEditor.latticeEditor.wrapper);
    }
}
