import Widget from "./Widget";

const selectors = {
    wrapper: "#defaultImportModalDialog",
    dialog: 'div[role="dialog"]',
    uploadInput: 'input[data-name="fileapi"]',
    addButton: '[data-name="upload-button"]',
    gridFileName: (fileName: string) =>
        `div[role="cell"][data-field="fileName"] div[title="${fileName}"]`,
    gridFormat: (format: string) => `div[role="cell"][data-field="format"] div[title="${format}"]`,
    removeButton: (fileName: string) => `button#${fileName}-remove-button`,
    submitButton: "#defaultImportModalDialog-submit-button",
    cancelButton: "#defaultImportModalDialog-cancel-button",
};

export interface ImportFile {
    filename: string;
    format: string;
}

export default class DefaultImportModalDialogWidget extends Widget {
    selectors: typeof selectors;

    constructor() {
        super(selectors.wrapper);
        this.selectors = this.getWrappedSelectors(selectors);
    }

    // eslint-disable-next-line default-param-last
    uploadFiles(filenames: ImportFile[] = []) {
        filenames.forEach(({ filename }) => {
            this.browser.uploadFileFromFilePath(this.selectors.uploadInput, filename);
        });
    }

    verifyFilesInGrid(expectedFiles: ImportFile[]) {
        expectedFiles.forEach((file) => {
            const fileNameSelector = this.selectors.gridFileName(file.filename);
            this.browser.waitForVisible(fileNameSelector);
        });
    }

    verifyFormatsInGrid(expectedFiles: ImportFile[]) {
        expectedFiles.forEach((file) => {
            const formatSelector = this.selectors.gridFormat(file.format);
            this.browser.waitForVisible(formatSelector);
        });
    }

    removeFile(file: ImportFile) {
        // filename has dots in it which messes with css selectors -> replace them with dashes
        const escapedFileName = file.filename.replace(/\./g, "-");
        const removeButtonSelector = this.selectors.removeButton(escapedFileName);
        this.browser.click(removeButtonSelector);
    }

    addButtonExists() {
        this.browser.waitForVisible(this.selectors.addButton);
    }

    submit() {
        this.browser.waitForVisible(this.selectors.submitButton);
        this.browser.click(this.selectors.submitButton);
    }

    cancel() {
        this.browser.waitForVisible(this.selectors.cancelButton);
        this.browser.click(this.selectors.cancelButton);
    }
}
