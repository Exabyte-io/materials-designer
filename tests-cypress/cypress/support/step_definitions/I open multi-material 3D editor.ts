import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I open multi-material 3D editor", function () {
    const {headerMenu, threeJSEditorWidget } = materialDesignerPage.designerWidget;
    headerMenu.selectMenuItemByNameAndItemNumber("View", 1);
    threeJSEditorWidget.waitForLoaderToDisappear();
});
