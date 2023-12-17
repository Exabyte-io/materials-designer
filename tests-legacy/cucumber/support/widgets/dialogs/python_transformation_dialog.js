import { SELECTORS } from "../../selectors";
import { Widget } from "../../widget";

export class PythonTransformationDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.pythonTransformationDialog);
    }

    selectMaterialByIndex(index) {
        exabrowser.scrollAndClick(this.wrappedSelectors.materialsSelector);
        exabrowser.scrollAndClick(
            SELECTORS.headerMenu.pythonTransformationDialog.materialsSelectorItem(index),
        );
    }

    selectDropdownItemByTitle(title) {
        exabrowser.scrollAndClick(this.wrappedSelectors.transformationSelector);
        exabrowser.scrollAndClick(
            SELECTORS.headerMenu.pythonTransformationDialog.transformationSelectorItem(title),
        );
    }

    // eslint-disable-next-line class-methods-use-this
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

    // eslint-disable-next-line class-methods-use-this
    getCodeMirrorContent(editorId) {
        // eslint-disable-next-line no-shadow
        return exabrowser.execute((editorId) => {
            const element = document.getElementById(editorId);
            return element.getElementsByClassName("cm-content")[0].cmView.view.state.doc.toString();
        }, editorId).value;
    }

    run() {
        exabrowser.waitForClickable(this.wrappedSelectors.runButton, 20000);
        exabrowser.scrollAndClick(this.wrappedSelectors.runButton);
        exabrowser.waitForClickable(this.wrappedSelectors.runButton, 20000);
    }

    clearOutput(index) {
        exabrowser.scrollAndClick(this.wrappedSelectors.clearOutputButton(index));
    }

    submit() {
        exabrowser.scrollAndClick(this.wrappedSelectors.submitButton);
    }

    cancel() {
        exabrowser.scrollAndClick(this.wrappedSelectors.cancelButton);
    }
}
