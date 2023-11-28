import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("the DefaultImportModalDialog should be closed", function () {
    materialDesignerPage.designerWidget.defaultImportModalDialog.waitForDisappear();
});
