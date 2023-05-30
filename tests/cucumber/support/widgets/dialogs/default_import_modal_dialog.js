import { SELECTORS } from "../../selectors";
import { Widget } from "../../widget";

const assert = require("assert");

export class DefaultImportModalDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.defaultImportModalDialog);
    }

    verifyDialogVisible() {
        const dialog = exabrowser.waitForExist(this.selectors.dialog);
        assert.ok(dialog);
    }

    uploadFiles({ files }) {
        const input = exabrowser.waitForExist('input[type="file"]');
        files.forEach((file) => {
            input.setValue(this.selectors.uploadInput, file);
        });
    }

    verifyFilesInGrid(expectedFiles) {
        expectedFiles.forEach((file) => {
            const fileInGrid = exabrowser.waitForExist((this.selectors.gridRow = `${file}`));
            assert.ok(fileInGrid);
        });
    }

    verifyFileFormats(expectedFormats) {
        expectedFormats.forEach((format) => {
            const formatInGrid = exabrowser.waitForExist((this.selectors.gridFormat = `${format}`));
            assert.ok(formatInGrid);
        });
    }

    removeFile(fileName) {
        const removeButton = exabrowser.waitForVisibleClickableOrExist(
            (this.selectors.removeButton = `${fileName}`),
        );
        removeButton.click();
    }

    verifyFileNotInGrid(fileName) {
        try {
            const fileInGrid = exabrowser.findElement(`${this.selectors.gridRow}='${fileName}'`);
            assert.ok(!fileInGrid);
        } catch (e) {
            if (e.name !== "NoSuchElementError") throw e;
        }
    }

    submit() {
        exabrowser.scrollAndClick(this.selectors.submitButton);
    }

    // verifyOnSubmitCalled() {
    //     const onSubmit = exabrowser.execute("return window.onSubmitCalled");
    //     assert.ok(onSubmit);
    // }

    verifyDialogClosed() {
        try {
            const dialog = exabrowser.waitForExist(this.selectors.dialog, { reverse: true });
            assert.ok(dialog);
        } catch (e) {
            if (e.name !== "NoSuchElementError") throw e;
        }
    }

    clickCancel() {
        exabrowser.scrollAndClick(this.selectors.cancelButton);
    }
}

export const defaultImportModalDialogWidget = new DefaultImportModalDialogWidget(
    SELECTORS.headerMenu.defaultImportModalDialog,
);
