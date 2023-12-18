import { Then } from "@badeball/cypress-cucumber-preprocessor";

import { shallowDeepAlmostEqual } from "../utils";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Then("I see code output with the data from the file {string}", (file: string) => {
    const { pythonTransformationDialog } = materialDesignerPage.designerWidget;

    cy.readFile(`./cypress/fixtures/${file}`).then((expectedContent) => {
        // Trimming the conents to remove any discrepancies in formatting
        if (typeof expectedContent === "string") {
            expectedContent.trim();
        }

        pythonTransformationDialog.getPythonOutput(0).then((content) => {
            if (typeof content === "string") {
                content.trim();
            }
            shallowDeepAlmostEqual(content, expectedContent);
        });
    });
});
