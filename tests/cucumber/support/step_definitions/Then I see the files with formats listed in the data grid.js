import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see the files with formats listed in the data grid$/, function (table) {
        const expectedFiles = parseTable(table, this);
        materialDesignerPage.designerWidget.defaultImportModalDialog.verifyFilesInGrid(
            expectedFiles,
        );
        materialDesignerPage.designerWidget.defaultImportModalDialog.verifyFormatsInGrid(
            expectedFiles,
        );
    });
}
