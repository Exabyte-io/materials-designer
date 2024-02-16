import { Then } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Then("I submit python transformation", () => {
    new MaterialDesignerPage().designerWidget.pythonTransformationDialog.submit();
});
