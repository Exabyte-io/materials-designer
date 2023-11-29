import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";

import { parseTable } from "../utils/table";
import { ImportFile } from "../widgets/DefaultImportModalDialogWidget";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I click the Remove button for a file", (table: DataTable) => {
    const file = parseTable<ImportFile>(table)[0];
    materialDesignerPage.designerWidget.defaultImportModalDialog.removeFile(file);
});
