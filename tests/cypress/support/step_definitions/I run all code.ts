import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I run all code", () => {
    materialDesignerPage.designerWidget.pythonTransformationDialog.runCode();
});
