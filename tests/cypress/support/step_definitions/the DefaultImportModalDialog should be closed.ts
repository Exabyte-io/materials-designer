import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("the DefaultImportModalDialog should be closed", () => {
    materialDesignerPage.designerWidget.defaultImportModalDialog.waitForDisappear();
});
