import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "../utils/table";
import { ImportFile } from "../widgets/DefaultImportModalDialogWidget";

Given("I upload files", function (table: DataTable) {
    const files = parseTable<ImportFile>(table);
    materialDesignerPage.designerWidget.defaultImportModalDialog.uploadFiles(files.map((file) => {
        return {
            ...file,
            filename: `./cypress/fixtures/${file.filename}`
        }
    }));
});
