import { When } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

When("I set code input from the file {string}", (fileName: string) => {
    cy.readFile(`./cypress/fixtures/${fileName}`).then((content) => {
        new MaterialDesignerPage().designerWidget.pythonTransformationDialog.setCode(content);
    });
});
