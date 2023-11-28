import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I set name of material with index {string} to {string}", function (index: string, name: string) {
    return materialDesignerPage.designerWidget.itemsList.setItemName(parseInt(index), name);
});
