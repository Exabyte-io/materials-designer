import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I delete materials with index {string}", function (index: string) {
    if (!index)
        throw new Error("I click delete action from the Edit menu - index is undefined");
    materialDesignerPage.designerWidget.clickDeleteAction(parseInt(index));
});
