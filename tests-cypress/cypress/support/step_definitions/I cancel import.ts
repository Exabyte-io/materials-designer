import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I cancel import", function () {
     materialDesignerPage.designerWidget.defaultImportModalDialog.cancel();
});
