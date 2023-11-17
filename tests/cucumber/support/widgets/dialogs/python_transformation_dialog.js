import { SELECTORS } from "../../selectors";
import { Widget } from "../../widget";

export class PythonTransformationDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.pythonTransformationDialog);
    }

    setPythonTransformationCode(code) {
        exabrowser.setValueWithBackspaceClear(this.selectors.codeInput, code);
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

    getPythonTransformationCode() {
        return exabrowser.getValue(this.selectors.codeInput);
    }

    getPythonTransformationOutput() {
        return exabrowser.getText(this.selectors.pythonOutput);
    }

    submit() {
        exabrowser.scrollAndClick(this.selectors.submitButton);
    }

    cancel() {
        exabrowser.scrollAndClick(this.selectors.cancelButton);
    }
}
