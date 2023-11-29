import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I click on {string} toolbar button", (title: string) => {
    materialDesignerPage.designerWidget.threeJSEditorWidget.clickOnToolbarButton(title);
});
