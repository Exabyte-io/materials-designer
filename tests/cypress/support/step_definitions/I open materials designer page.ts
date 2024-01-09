import { Given } from "@badeball/cypress-cucumber-preprocessor";
import BrowserFactory from "@exabyte-io/code.js/dist/cypress/BrowserFactory";

import SETTINGS from "../settings";
import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

beforeEach(() => {
    cy.log("HERE");
    BrowserFactory.setBrowserSettings(SETTINGS);
    cy.log("I run before every test in every spec file!!!!!!");
});

Given("I open materials designer page", () => {
    new MaterialDesignerPage().open();
});
