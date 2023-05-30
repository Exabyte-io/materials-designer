import { parseTable } from "../utils/table";
import { defaultImportModalDialogWidget } from "../widgets/dialogs/default_import_modal_dialog";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I open DefaultImportModalDialog/, () => {
        materialDesignerPage.designerWidget.headerMenu.selectMenuItemByNameAndItemNumber(
            "Input/Output",
            1,
        );
    });

    this.Then(/^I see DefaultImportModalDialog$/, () => {
        console.log("***** dialog_steps, I see DefaultImportModalDialog");
        console.log(defaultImportModalDialogWidget, defaultImportModalDialogWidget.dialog);
        defaultImportModalDialogWidget.dialog.waitForVisible();
    });

    this.When(/^I upload files$/, function (table) {
        const files = parseTable(table, this);
        defaultImportModalDialogWidget.uploadFiles(files);
    });

    this.Then(/^I should see the files listed in the data grid$/, function (table) {
        const expectedFiles = parseTable(table, this);
        defaultImportModalDialogWidget.verifyFilesInGrid(expectedFiles);
    });

    this.Then(/^the formats of the files should be displayed$/, function (table) {
        const expectedFormats = parseTable(table, this);
        defaultImportModalDialogWidget.verifyFileFormats(expectedFormats);
    });

    this.When(/^I click the Remove button for a file$/, (fileName) => {
        defaultImportModalDialogWidget.removeFile(fileName);
    });

    this.Then(/^that file should no longer be listed in the data grid$/, (fileName) => {
        defaultImportModalDialogWidget.verifyFileNotInGrid(fileName);
    });

    this.When(/^I click the Submit button$/, () => {
        defaultImportModalDialogWidget.submit();
    });

    this.Then(/^the onSubmit function should be called$/, () => {
        // replace this with actual verification of onSubmit function call
        defaultImportModalDialogWidget.verifyOnSubmitCalled();
    });

    this.Then(/^the DefaultImportModalDialog should be closed$/, () => {
        defaultImportModalDialogWidget.verifyDialogClosed();
    });

    this.When(/^I cancel import$/, () => {
        defaultImportModalDialogWidget.clickCancel();
    });

    this.Then(/^I cancel import$/, () => {
        defaultImportModalDialogWidget.dialog.waitForDissapear(); // ???
    });
}
