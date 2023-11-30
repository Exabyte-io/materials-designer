import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I set name of material with index {string} to {string}", (index: string, name: string) => {
    return materialDesignerPage.designerWidget.itemsList.setItemName(parseInt(index, 10), name);
});
