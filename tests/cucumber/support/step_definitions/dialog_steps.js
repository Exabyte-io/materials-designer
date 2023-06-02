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
        materialDesignerPage.designerWidget.defaultImportModalDialog.addButtonExists();
    });

    this.When(/^I click the Remove button for a file$/, function (table) {
        const file = parseTable(table, this)[0];
        materialDesignerPage.designerWidget.defaultImportModalDialog.removeFile(file);
    });

    this.When(/^I click the Submit button$/, () => {
        materialDesignerPage.designerWidget.defaultImportModalDialog.submit();
    });

    this.Then(/^the DefaultImportModalDialog should be closed$/, () => {
        materialDesignerPage.designerWidget.defaultImportModalDialog.waitForDisappear();
    });

    this.When(/^I cancel import$/, () => {
        materialDesignerPage.designerWidget.defaultImportModalDialog.cancel();
    });
}
