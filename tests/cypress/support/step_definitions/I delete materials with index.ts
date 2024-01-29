import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I delete materials with index {string}", (index: string) => {
    if (!index) throw new Error("I click delete action from the Edit menu - index is undefined");
    new MaterialDesignerPage().designerWidget.clickDeleteAction(parseInt(index, 10));
});
