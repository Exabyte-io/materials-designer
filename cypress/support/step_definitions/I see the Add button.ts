import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I see the Add button", () => {
    materialDesignerPage.designerWidget.defaultImportModalDialog.addButtonExists();
});
