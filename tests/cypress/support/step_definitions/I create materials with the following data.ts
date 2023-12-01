import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";

import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I create materials with the following data", (table: DataTable) => {
    const rows = parseTable(table);
    materialDesignerPage.designerWidget.createMultipleMaterials(rows);
});
