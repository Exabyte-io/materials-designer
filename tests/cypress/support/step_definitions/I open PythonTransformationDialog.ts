import { When } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

When("I open PythonTransformationDialog", () => {
    new MaterialDesignerPage().designerWidget.headerMenu.selectMenuItemByNameAndItemNumber(
        "Advanced",
        6,
    );
});
