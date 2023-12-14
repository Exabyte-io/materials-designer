import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I see UploadDialog", () => {
    materialDesignerPage.designerWidget.defaultImportModalDialog.isVisible();
});
