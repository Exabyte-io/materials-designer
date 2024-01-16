import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "@mat3ra/tede/src/js/cypress/utils/table";

import { ImportFile } from "../widgets/DefaultImportModalDialogWidget";
import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I click the Remove button for a file", (table: DataTable) => {
    const file = parseTable<ImportFile>(table)[0];
    new MaterialDesignerPage().designerWidget.defaultImportModalDialog.removeFile(file);
});
