import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I open multi-material 3D editor", () => {
    const { headerMenu, threeJSEditorWidget } = new MaterialDesignerPage().designerWidget;
    headerMenu.selectMenuItemByNameAndItemNumber("View", 1);
    threeJSEditorWidget.waitForLoaderToDisappear();
});
