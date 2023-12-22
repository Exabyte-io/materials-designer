import { Then } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Then("I see code output with the data from the file {string}", (file: string) => {
    const { pythonTransformationDialog } = materialDesignerPage.designerWidget;

    cy.readFile(`./cypress/fixtures/${file}`).then((expectedContent) => {
        pythonTransformationDialog.getPythonOutput(0).then((actualContent: string) => {
            expect(expectedContent.trim()).to.equal(actualContent.trim());
        });
    });
});
