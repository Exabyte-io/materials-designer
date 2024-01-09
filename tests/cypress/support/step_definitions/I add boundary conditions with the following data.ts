import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import BrowserFactory from "@exabyte-io/code.js/dist/cypress/BrowserFactory";
import { parseTable } from "@exabyte-io/code.js/dist/cypress/utils/table";

import SETTINGS from "../settings";
import { BoundaryConditions } from "../widgets/BoundaryConditionsDialogWidget";
import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

beforeEach(() => {
    cy.log("HERE");
    BrowserFactory.setBrowserSettings(SETTINGS);
    // cy.log("I run before every test in every spec file!!!!!!");
});

Given("I add boundary conditions with the following data:", (table: DataTable) => {
    const config = parseTable<BoundaryConditions>(table)[0];
    new MaterialDesignerPage().designerWidget.addBoundaryConditions(config);
});
