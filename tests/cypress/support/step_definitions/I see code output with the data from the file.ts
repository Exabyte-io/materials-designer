import { Then } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Then("I see code output with the data from the file {string}", (file: string) => {
    const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
    cy.readFile(`./cypress/fixtures/${file}`).then((expectedContent: string) => {
        pythonTransformationDialog.getCode(0).then((actualContent: string) => {
            actualContent.replace(/\s/g, "");
            expectedContent.replace(/\s/g, "");
            expect(expectedContent).to.equal(actualContent);
        });
    });
});
