import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I see UploadDialog", () => {
    new MaterialDesignerPage().designerWidget.defaultImportModalDialog.waitForVisible();
});
