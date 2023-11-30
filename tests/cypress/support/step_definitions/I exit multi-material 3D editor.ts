import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I exit multi-material 3D editor", () => {
    materialDesignerPage.designerWidget.threeJSEditorWidget.clickOnMenuItem("File", "Exit");
    materialDesignerPage.designerWidget.threeJSEditorWidget.waitForModalBackdropDisappear();
    materialDesignerPage.designerWidget.waitForVisible();
    materialDesignerPage.designerWidget.waitForLoaderToDisappear();
});
