import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I see DefaultImportModalDialog", function () {
    materialDesignerPage.designerWidget.defaultImportModalDialog.isVisible();
});
