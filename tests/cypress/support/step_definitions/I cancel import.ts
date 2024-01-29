import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I cancel import", () => {
    new MaterialDesignerPage().designerWidget.defaultImportModalDialog.cancel();
});
