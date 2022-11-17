/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { SELECTORS } from "../selectors";
import { Widget } from "../widget";

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
        exabrowser.scrollAndClick(this._selectors.latticeFormSaveButton);
    }

    // eslint-disable-next-line class-methods-use-this
    getLattice() {
        // TBA
    }

    setLatticeParamInput(name, value) {
        exabrowser.waitForVisible(this._selectors.latticeOptionSelectorByNameInput(name));
        exabrowser.setValue(this._selectors.latticeOptionSelectorByNameInput(name), value);
    }

    setLatticeParamSelect(name, value) {
        const latticeOptionSelector = this._selectors.latticeOptionSelectorByNameSelect(name);
        exabrowser.waitForVisible(latticeOptionSelector);
        // TODO: find the reason for unreliable selectByValue and remove browser.pause
        // 'selectByValue` could be buggy: https://github.com/webdriverio/webdriverio/issues/1689
        exabrowser.pause(1000);
        exabrowser.selectByValue(latticeOptionSelector, value);
    }

    setLattice(latticeObject) {
        this.openLatticeForm();
        Object.keys(latticeObject).forEach((key) => {
            const value = latticeObject[key];
            if (key === "type") this.setLatticeParamSelect(key, value);
            else this.setLatticeParamInput(key, value);
        });
        this.updateLatticeConfiguration();
        this.closeLatticeForm();
    }
}

class BasisEditorWidget extends Widget {
    constructor(selector) {
        super(selector);
        this._selectors = this.getWrappedSelectors(SELECTORS.sourceEditor.basisEditor);
    }

    // parse text from feature table to basis text in final form
    _parseTableTextToBasisString(basisTextInTable) {
        const basisLines = basisTextInTable.split(";");
        return basisLines.join("\n");
    }

    getCodeMirrorContent(editorId) {
        // eslint-disable-next-line no-shadow
        return exabrowser.execute((editorId) => {
            const element = document.getElementById(editorId);
            return element.getElementsByClassName("CodeMirror")[0].CodeMirror.getValue();
        }, editorId).value;
    }

    setCodeMirrorContent(editorId, content, preserveExistingContent = false) {
        // eslint-disable-next-line no-shadow
        exabrowser.execute((editorId, content, preserveExistingContent) => {
            const element = document.getElementById(editorId);
            const codeMirror = element.getElementsByClassName("CodeMirror")[0].CodeMirror;
            codeMirror.setValue(preserveExistingContent ? codeMirror.getValue() + "\n" + content : content);
        }, editorId, content, preserveExistingContent);
    }

    getBasisText() {
        return this.getCodeMirrorContent(SELECTORS.sourceEditor.basisEditor.basisTextArea);
    }

    setBasisUnits(unitsName) {
        this.waitForMaterialInit();
        exabrowser.scrollAndClick(this._selectors.basisUnitsByName(unitsName));
    }

    setBasis(basisTextInTable) {
        const clsInstance = this;
        const basisText = this._parseTableTextToBasisString(basisTextInTable);
        clsInstance.setCodeMirrorContent(
            SELECTORS.sourceEditor.basisEditor.basisTextArea,
            basisText,
        );
    }
}

export class SourceEditorWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.basisEditor = new BasisEditorWidget(SELECTORS.sourceEditor.basisEditor.wrapper);
        this.latticeEditor = new LatticeEditorWidget(SELECTORS.sourceEditor.latticeEditor.wrapper);
    }
}
