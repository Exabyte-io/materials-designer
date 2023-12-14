import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I see PythonTransformationDialog", () => {
    materialDesignerPage.designerWidget.pythonTransformationDialog.isVisible();
});
