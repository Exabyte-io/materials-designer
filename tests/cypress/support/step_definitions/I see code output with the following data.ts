import { Then } from "@badeball/cypress-cucumber-preprocessor";

import { shallowDeepAlmostEqual } from "../utils";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Then("I see code output with the following data", (docString: string) => {
    const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
    console.log("docString", docString);
    // Using Cypress commands to handle the promise returned by getPythonOutput
    pythonTransformationDialog.getCode(0).then((actualContent) => {
        shallowDeepAlmostEqual(docString, actualContent);
    });
});
