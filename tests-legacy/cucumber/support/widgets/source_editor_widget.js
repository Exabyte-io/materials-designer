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
        const selectSelector = this._selectors.latticeOptionSelectorByNameSelect(name);
        exabrowser.waitForVisible(selectSelector);
        exabrowser.click(selectSelector);

        const menuItemSelector = `li[data-value="${value}"]`;
        exabrowser.waitForVisible(menuItemSelector);
        exabrowser.click(menuItemSelector);
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
            return element
                .getElementsByClassName("cm-content")[0]
                .cmView.editorView.state.doc.toString();
        }, editorId).value;
    }

    setCodeMirrorContent(editorId, content, preserveExistingContent = false) {
        exabrowser.execute(
            // eslint-disable-next-line no-shadow
            (editorId, content, preserveExistingContent) => {
                const element = document.getElementById(editorId);

                const editor = element.getElementsByClassName("cm-content")[0].cmView.view;
                editor.focus();
                const stateLength = editor.state.doc.length;
                const transactionPayload = preserveExistingContent
                    ? {
                          changes: { from: stateLength, insert: `\n${content}` },
                      }
                    : {
                          changes: { from: 0, to: stateLength, insert: content },
                      };
                const transaction = editor.state.update(transactionPayload);
                editor.dispatch(transaction);
            },
            editorId,
            content,
            preserveExistingContent,
        );
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
