import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "@mat3ra/tede/src/js/cypress/utils/table";

import { ImportFile } from "../widgets/DefaultImportModalDialogWidget";
import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I see the files with formats listed in the data grid", (table: DataTable) => {
    const expectedFiles = parseTable<ImportFile>(table);
    const page = new MaterialDesignerPage();
    page.designerWidget.defaultImportModalDialog.verifyFilesInGrid(expectedFiles);
    page.designerWidget.defaultImportModalDialog.verifyFormatsInGrid(expectedFiles);
});
