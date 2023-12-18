import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I clear the output with index {string}", (index: string) => {
    materialDesignerPage.designerWidget.pythonTransformationDialog.clearOutput(parseInt(index, 10));
});
