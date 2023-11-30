import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";

import { parseTable } from "../utils/table";
import { ImportFile } from "../widgets/DefaultImportModalDialogWidget";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I see the files with formats listed in the data grid", (table: DataTable) => {
    const expectedFiles = parseTable<ImportFile>(table);
    materialDesignerPage.designerWidget.defaultImportModalDialog.verifyFilesInGrid(expectedFiles);
    materialDesignerPage.designerWidget.defaultImportModalDialog.verifyFormatsInGrid(expectedFiles);
});
