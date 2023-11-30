import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";

import { parseTable } from "../utils/table";
import { ImportFile } from "../widgets/DefaultImportModalDialogWidget";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I upload files", (table: DataTable) => {
    const files = parseTable<ImportFile>(table);
    materialDesignerPage.designerWidget.defaultImportModalDialog.uploadFiles(
        files.map((file) => {
            return {
                ...file,
                filename: `./cypress/fixtures/${file.filename}`,
            };
        }),
    );
});
