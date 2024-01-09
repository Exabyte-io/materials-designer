import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I open UploadDialog", () => {
    new MaterialDesignerPage().designerWidget.headerMenu.selectMenuItemByNameAndItemNumber(
        "Input/Output",
        3,
    );
});
