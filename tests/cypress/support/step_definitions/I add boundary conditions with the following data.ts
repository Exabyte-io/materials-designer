import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "@mat3ra/tede/src/js/cypress/utils/table";

import { BoundaryConditions } from "../widgets/BoundaryConditionsDialogWidget";
import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I add boundary conditions with the following data:", (table: DataTable) => {
    const config = parseTable<BoundaryConditions>(table)[0];
    new MaterialDesignerPage().designerWidget.addBoundaryConditions(config);
});
