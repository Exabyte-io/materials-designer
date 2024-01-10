import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
// import BrowserFactory from "@exabyte-io/code.js/dist/cypress/BrowserFactory";
import { parseTable } from "@exabyte-io/code.js/dist/cypress/utils/table";

// import SETTINGS from "../settings";
import { BoundaryConditions } from "../widgets/BoundaryConditionsDialogWidget";
import MaterialDesignerPage from "../widgets/MaterialDesignerPage";
// import SETTINGS from "./settings";

// beforeEach(() => {
//     BrowserFactory.setBrowserSettings(SETTINGS);
// });

Given("I add boundary conditions with the following data:", (table: DataTable) => {
    const config = parseTable<BoundaryConditions>(table)[0];
    new MaterialDesignerPage().designerWidget.addBoundaryConditions(config);
});
