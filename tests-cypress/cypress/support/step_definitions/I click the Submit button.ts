import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I click the Submit button", function () {
    materialDesignerPage.designerWidget.defaultImportModalDialog.submit();
});
