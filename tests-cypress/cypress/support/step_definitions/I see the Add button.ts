import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I see the Add button", function () {
    materialDesignerPage.designerWidget.defaultImportModalDialog.addButtonExists();
});
