import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I open multi-material 3D editor", () => {
    const { headerMenu, threeJSEditorWidget } = materialDesignerPage.designerWidget;
    headerMenu.selectMenuItemByNameAndItemNumber("View", 1);
    threeJSEditorWidget.waitForLoaderToDisappear();
});
