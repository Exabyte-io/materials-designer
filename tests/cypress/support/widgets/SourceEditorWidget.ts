/* eslint-disable max-classes-per-file */
import Widget from "./Widget";

const latticeEditorSelectors = {
    wrapper: ".crystal-lattice",
    latticeFormTrigger: '[role="button"]',
    latticeFormBody: ".crystal-lattice-config",
    latticeOptionSelectorByNameInput: (name: string) => `input[name="${name}"]`,
    latticeOptionSelectorByNameSelect: (name: string) => `[data-tid="${name}"]`,
    latticeFormSaveButton: "button.save-lattice-config",
};

class LatticeEditorWidget extends Widget {
    selectors: typeof latticeEditorSelectors;

    constructor() {
        super(latticeEditorSelectors.wrapper);
        this.selectors = this.getWrappedSelectors(latticeEditorSelectors);
    }

    openLatticeForm() {
        return this.browser.click(this.selectors.latticeFormTrigger).then(() => {
            return this.browser.waitForVisible(this.selectors.latticeFormBody);
        });
    }

    closeLatticeForm() {
        return this.browser.click(this.selectors.latticeFormTrigger).then(() => {
            return this.browser.waitForHide(this.selectors.latticeFormBody);
        });
    }

    updateLatticeConfiguration() {
        return this.browser.click(this.selectors.latticeFormSaveButton);
    }

    setLatticeParamInput(name: string, value: string) {
        this.browser.waitForVisible(this.selectors.latticeOptionSelectorByNameInput(name));
        this.browser.setInputValue(
            this.selectors.latticeOptionSelectorByNameInput(name),
            value,
            false,
        );
    }

    setLatticeParamSelect(name: string, value: string) {
        const selectSelector = this.selectors.latticeOptionSelectorByNameSelect(name);
        const menuItemSelector = `li[data-value="${value}"]`;

        return this.browser
            .waitForVisible(selectSelector)
            .then(() => {
                return this.browser.click(selectSelector);
            })
            .then(() => {
                return this.browser.waitForVisible(menuItemSelector);
            })
            .then(() => {
                return this.browser.click(menuItemSelector);
            });
    }

    setLattice(latticeObject: object) {
        const res = this.openLatticeForm();

        return Object.keys(latticeObject)
            .reduce((acc, key) => {
                const value = latticeObject[key];
                if (key === "type") {
                    return acc.then(() => this.setLatticeParamSelect(key, value));
                }
                return acc.then(() => this.setLatticeParamInput(key, value));
            }, res)
            .then(() => {
                return this.updateLatticeConfiguration();
            })
            .then(() => {
                return this.closeLatticeForm();
            });
    }
}

const basisEditor = {
    wrapper: "",
    basisTextArea: "basis-xyz",
};

class BasisEditorWidget extends Widget {
    selectors: typeof basisEditor;

    constructor() {
        super("");
        this.selectors = this.getWrappedSelectors(basisEditor);
    }

    // parse text from feature table to basis text in final form
    _parseTableTextToBasisString(basisTextInTable: string) {
        const basisLines = basisTextInTable.split(";");
        return basisLines.join("\n");
    }

    getCodeMirrorContent(editorId: string) {
        return this.browser.execute((win) => {
            const element = win.document.getElementById(editorId);
            return element
                ?.getElementsByClassName("cm-content")[0]
                .cmView.editorView.state.doc.toString();
        });
    }

    setCodeMirrorContent(editorId: string, content: string, preserveExistingContent = false) {
        return this.browser.execute((win) => {
            const element = win.document.getElementById(editorId);

            if (!element) {
                throw new Error(`setCodeMirrorContent: Element not found by Id : ${editorId}`);
            }

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
        });
    }

    getBasisText() {
        return this.getCodeMirrorContent(basisEditor.basisTextArea);
    }

    setBasis(basisTextInTable: string) {
        return this.setCodeMirrorContent(
            basisEditor.basisTextArea,
            this._parseTableTextToBasisString(basisTextInTable),
        );
    }
}

export class SourceEditorWidget extends Widget {
    basisEditor: BasisEditorWidget;

    latticeEditor: LatticeEditorWidget;

    constructor() {
        super("");
        this.basisEditor = new BasisEditorWidget();
        this.latticeEditor = new LatticeEditorWidget();
    }
}
