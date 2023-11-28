import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I open DefaultImportModalDialog", function () {
    materialDesignerPage.designerWidget.headerMenu.selectMenuItemByNameAndItemNumber(
        "Input/Output",
        1,
    );
});
