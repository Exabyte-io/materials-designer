import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I cancel import", () => {
    materialDesignerPage.designerWidget.defaultImportModalDialog.cancel();
});
