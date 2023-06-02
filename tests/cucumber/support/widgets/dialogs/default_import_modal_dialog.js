import assert from "assert";
import path from "path";
import { safeMakeArray } from "@exabyte-io/code.js/dist/utils/array";

import { SELECTORS } from "../../selectors";
import { Widget } from "../../widget";

export class DefaultImportModalDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = this.getWrappedSelectors(SELECTORS.headerMenu.defaultImportModalDialog);
    }

    // eslint-disable-next-line default-param-last
    uploadFiles(filenames = []) {
        const directory = path.resolve(__dirname, "../../../fixtures");
        safeMakeArray(filenames).forEach(({ filename }) =>
            this.uploadFile(path.join(directory, filename)),
        );
    }

    uploadFile(filePath) {
        // Make input visible
        exabrowser.execute((selector) => {
            const elem = document.querySelector(selector);
            elem.style.display = "block";
            elem.hidden = false;
        }, this.selectors.uploadInput);
        exabrowser.waitForVisible(this.selectors.uploadInput);
        // Upload the file
        exabrowser.chooseFileWithClear(this.selectors.uploadInput, filePath);
        // Hide the input again
        exabrowser.execute((selector) => {
            const elem = document.querySelector(selector);
            elem.style.display = "none";
            elem.hidden = true;
        }, this.selectors.uploadInput);
    }

    verifyFilesInGrid(expectedFiles) {
        expectedFiles.forEach((file) => {
            const fileNameSelector = `${this.selectors.gridFileName} div[title="${file.filename}"]`;
            exabrowser.waitForVisible(fileNameSelector);
        });
    }

    verifyFormatsInGrid(expectedFiles) {
        expectedFiles.forEach((file) => {
            const formatSelector = `${this.selectors.gridFormat} div[title="${file.format}"]`;
            exabrowser.waitForVisible(formatSelector);
        });
    }

    verifyAddButtonExists;

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

    cancel() {
        exabrowser.scrollAndClick(this.selectors.defaultImportModalDialog.cancelButton);
    }
}

export const defaultImportModalDialogWidget = new DefaultImportModalDialogWidget(
    SELECTORS.headerMenu.defaultImportModalDialog,
);
