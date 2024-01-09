import { When } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

When("I cancel PythonTransformationDialog", () => {
    new MaterialDesignerPage().designerWidget.pythonTransformationDialog.cancel();
});
