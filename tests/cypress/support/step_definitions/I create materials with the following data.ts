import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "@mat3ra/tede/src/js/cypress/utils/table";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I create materials with the following data", (table: DataTable) => {
    const rows = parseTable(table);
    new MaterialDesignerPage().designerWidget.createMultipleMaterials(rows);
});
