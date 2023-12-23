import { Then } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Then("I see code output {string} with the data from the file {string}", (id: number, file: string) => {
    const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
    cy.readFile(`./cypress/fixtures/${file}`).then((expectedContent: string) => {
        pythonTransformationDialog.getCode(id).then((actualContent: string) => {
            expect(expectedContent.replace(/\s/g, "")).to.equal(actualContent.replace(/\s/g, ""));
        });
    });
});
