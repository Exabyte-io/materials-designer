import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I click on {string} toolbar button", (title: string) => {
    new MaterialDesignerPage().designerWidget.threeJSEditorWidget.clickOnToolbarButton(title);
});
