import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I cancel PythonTransformationDialog", () => {
    materialDesignerPage.designerWidget.pythonTransformationDialog.cancel();
});
