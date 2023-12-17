import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I clear the output with index {number}", (index: number) => {
    materialDesignerPage.designerWidget.pythonTransformationDialog.clearOutput(index);
});
