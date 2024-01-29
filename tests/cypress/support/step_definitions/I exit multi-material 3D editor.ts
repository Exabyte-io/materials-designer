import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I exit multi-material 3D editor", () => {
    const page = new MaterialDesignerPage();
    page.designerWidget.threeJSEditorWidget.clickOnMenuItem("File", "Exit");
    page.designerWidget.threeJSEditorWidget.waitForModalBackdropDisappear();
    page.designerWidget.waitForVisible();
    page.designerWidget.waitForLoaderToDisappear();
});
