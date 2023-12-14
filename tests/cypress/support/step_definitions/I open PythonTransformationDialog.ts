import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I open PythonTransformationDialog", () => {
    materialDesignerPage.designerWidget.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 6);
});
