import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "../utils/table";


Given("I create materials with the following data", function (table: DataTable) {
    const rows = parseTable(table);
    materialDesignerPage.designerWidget.createMultipleMaterials(rows);
});
