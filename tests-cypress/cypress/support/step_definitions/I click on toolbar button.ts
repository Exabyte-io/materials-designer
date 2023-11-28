import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I click on {string} toolbar button", function (title: string) {
    materialDesignerPage.designerWidget.threeJSEditorWidget.clickOnToolbarButton(title);
});
