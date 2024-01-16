import { When } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

When("I open Standata dialog", () => {
    new MaterialDesignerPage().designerWidget.headerMenu.selectMenuItemByNameAndItemNumber(
        "Input/Output",
        2,
    );
});
