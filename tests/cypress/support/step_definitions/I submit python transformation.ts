import { Then } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Then("I submit python transformation", () => {
    materialDesignerPage.designerWidget.pythonTransformationDialog.submit();
});
