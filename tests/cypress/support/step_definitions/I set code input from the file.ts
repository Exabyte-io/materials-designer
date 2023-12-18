import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I set code input from the file {string}", (fileName: string) => {
    cy.readFile(`./cypress/fixtures/${fileName}`).then((content) => {
        materialDesignerPage.designerWidget.pythonTransformationDialog.setCode(content);
    });
});
