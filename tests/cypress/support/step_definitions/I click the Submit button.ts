import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I click the Submit button", () => {
    materialDesignerPage.designerWidget.defaultImportModalDialog.submit();
});
