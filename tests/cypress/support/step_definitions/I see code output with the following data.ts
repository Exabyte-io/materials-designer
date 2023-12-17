import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { deepEqual } from "assert";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Then("I see code output with the following data", (docString: string) => {
    const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
    const content = pythonTransformationDialog.getPythonOutput(0).then((content) => {
        if (typeof content === "string") content.trim();
    });
    deepEqual(content, docString);
});
