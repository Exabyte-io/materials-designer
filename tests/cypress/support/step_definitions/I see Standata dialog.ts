import { Then } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Then("I see Standata dialog", () => {
    materialDesignerPage.designerWidget.standataDialog.verifyStandataDialog();
});
