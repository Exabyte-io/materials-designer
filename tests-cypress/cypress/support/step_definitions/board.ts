import { When, Then, Given, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { SurfaceConfig } from "../widgets/SurfaceDialogWidget";


Given("I am on empty home page", () => {
  cy.visit("localhost:3001");
});

When("I type and submit in the board name", () => {
  cy.get("[data-cy=first-board]").type('new board{enter}');
});

Then("I should be redirected to the board detail", () => {
  cy.location("pathname").should('match', /\/board\/\d/);
});

// ======START

Given("I open materials designer page", () => {
  cy.visit("localhost:3001");
});

When("I create a surface with the following data:", (table: DataTable) => {
  const context = {}
  const parsedTable = parseTable<SurfaceConfig>(table, context);
  console.log({
    table,
    parsedTable,
    context
  })
  materialDesignerPage.designerWidget.createSurface(parsedTable[0]);
});

Then("material with following data exists in state", () => {
  cy.visit("localhost:3001");
});

When("I add boundary conditions with the following data:", () => {
  cy.visit("localhost:3001");
});



