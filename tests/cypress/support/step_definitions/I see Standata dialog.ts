import { Then } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Then("I see Standata dialog", () => {
    new MaterialDesignerPage().designerWidget.standataDialog.verifyStandataDialog();
});
