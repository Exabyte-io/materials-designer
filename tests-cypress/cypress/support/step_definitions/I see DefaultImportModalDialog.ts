import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I see DefaultImportModalDialog", () => {
    materialDesignerPage.designerWidget.defaultImportModalDialog.isVisible();
});
