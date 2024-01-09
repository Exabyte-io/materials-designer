import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("the UploadDialog should be closed", () => {
    new MaterialDesignerPage().designerWidget.defaultImportModalDialog.waitForDisappear();
});
