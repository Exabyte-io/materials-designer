import { When } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

When("I run all code", () => {
    new MaterialDesignerPage().designerWidget.pythonTransformationDialog.runCode();
});
