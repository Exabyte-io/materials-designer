import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I set name of material with index {string} to {string}", (index: string, name: string) => {
    return new MaterialDesignerPage().designerWidget.itemsList.setItemName(
        parseInt(index, 10),
        name,
    );
});
