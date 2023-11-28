import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "../utils/table";

Given("I add boundary conditions with the following data:", function (table: DataTable) {
    const config = parseTable(table)[0];
    materialDesignerPage.designerWidget.addBoundaryConditions(config);
});
