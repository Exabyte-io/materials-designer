import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { deepEqual } from "assert";
import { readFileSync } from "fs";
import path from "path";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Then("I see code output with the data from the file {string}", (file: string) => {
    const { pythonTransformationDialog } = materialDesignerPage.designerWidget;

    const expectedContent = readFileSync(path.resolve(__dirname, "../../fixtures", file));
    const content = pythonTransformationDialog.getPythonOutput(0).then((content) => {
        if (typeof content === "string") content.trim();
    });
    deepEqual(content, expectedContent);
});
