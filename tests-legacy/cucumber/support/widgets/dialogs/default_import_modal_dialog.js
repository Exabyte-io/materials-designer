import { safeMakeArray } from "@mat3ra/code/dist/js/utils";
import path from "path";

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
            const fileNameSelector = this.selectors.gridFileName(file.filename);
            exabrowser.waitForVisible(fileNameSelector);
        });
    }

    verifyFormatsInGrid(expectedFiles) {
        expectedFiles.forEach((file) => {
            const formatSelector = this.selectors.gridFormat(file.format);
            exabrowser.waitForVisible(formatSelector);
        });
    }

    removeFile(file) {
        // filename has dots in it which messes with css selectors -> replace them with dashes
        const escapedFileName = file.filename.replace(/\./g, "-");
        const removeButtonSelector = this.selectors.removeButton(escapedFileName);
        exabrowser.waitForVisibleClickableOrExist(removeButtonSelector);
        exabrowser.scrollAndClick(removeButtonSelector);
    }

    addButtonExists() {
        exabrowser.waitForVisibleClickableOrExist(this.selectors.addButton);
    }

    submit() {
        exabrowser.waitForVisibleClickableOrExist(this.selectors.submitButton);
        exabrowser.scrollAndClick(this.selectors.submitButton);
    }

    cancel() {
        exabrowser.waitForVisibleClickableOrExist(this.selectors.cancelButton);
        exabrowser.scrollAndClick(this.selectors.cancelButton);
    }
}

export const defaultImportModalDialogWidget = new DefaultImportModalDialogWidget(
    SELECTORS.headerMenu.defaultImportModalDialog,
);
