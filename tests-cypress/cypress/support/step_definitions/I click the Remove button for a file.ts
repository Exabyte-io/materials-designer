import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "../utils/table";
import { ImportFile } from "../widgets/DefaultImportModalDialogWidget";

Given("I click the Remove button for a file", function (table: DataTable) {
    const file = parseTable<ImportFile>(table)[0];
    materialDesignerPage.designerWidget.defaultImportModalDialog.removeFile(file);
});
