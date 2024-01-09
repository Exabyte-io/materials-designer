import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I click the Submit button", () => {
    new MaterialDesignerPage().designerWidget.defaultImportModalDialog.submit();
});
