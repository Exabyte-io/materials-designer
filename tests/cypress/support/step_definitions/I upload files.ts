import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "@mat3ra/tede/src/js/cypress/utils/table";

import { ImportFile } from "../widgets/DefaultImportModalDialogWidget";
import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I upload files", (table: DataTable) => {
    const files = parseTable<ImportFile>(table);
    new MaterialDesignerPage().designerWidget.defaultImportModalDialog.uploadFiles(
        files.map((file) => {
            return {
                ...file,
                filename: `./cypress/fixtures/${file.filename}`,
            };
        }),
    );
});
