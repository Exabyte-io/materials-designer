import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";

import { parseTable } from "../utils/table";
import { BoundaryConditions } from "../widgets/BoundaryConditionsDialogWidget";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I add boundary conditions with the following data:", (table: DataTable) => {
    const config = parseTable<BoundaryConditions>(table)[0];
    materialDesignerPage.designerWidget.addBoundaryConditions(config);
});
