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
        materialDesignerPage.designerWidget.defaultImportModalDialog.isVisible();
    });

    this.When(/^I upload files$/, function (table) {
        const filenames = parseTable(table, this);
        materialDesignerPage.designerWidget.defaultImportModalDialog.uploadFiles(filenames);
    });

    this.Then(/^I see the files with formats listed in the data grid$/, function (table) {
        const expectedFiles = parseTable(table, this);
        materialDesignerPage.designerWidget.defaultImportModalDialog.verifyFilesInGrid(
            expectedFiles,
        );
        materialDesignerPage.designerWidget.defaultImportModalDialog.verifyFormatsInGrid(
            expectedFiles,
        );
    });

    this.Then(/^I see the Add button$/, () => {
        materialDesignerPage.designerWidget.defaultImportModalDialog.addButton.isVisible();
    });

    this.Then(/^the formats of the files should be displayed$/, function (table) {
        const expectedFormats = parseTable(table, this);
        materialDesignerPage.designerWidget.defaultImportModalDialog.verifyFileFormats(
            expectedFormats,
        );
    });

    this.When(/^I click the Remove button for a file$/, (fileName) => {
        materialDesignerPage.designerWidget.defaultImportModalDialog.removeFile(fileName);
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
        defaultImportModalDialogWidget.cancel();
    });

    this.Then(/^the DefaultImportModalDialog should be closed$/, () => {
        defaultImportModalDialogWidget.dialog.waitForDissapear(); // ???
    });
}
