import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I see the Add button", () => {
    new MaterialDesignerPage().designerWidget.defaultImportModalDialog.addButtonExists();
});
