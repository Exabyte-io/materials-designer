import { When } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

When("I see PythonTransformationDialog", () => {
    new MaterialDesignerPage().designerWidget.pythonTransformationDialog.waitForVisible();
});
