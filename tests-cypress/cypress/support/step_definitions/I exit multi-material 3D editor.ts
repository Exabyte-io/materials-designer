import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I exit multi-material 3D editor", function () {
    materialDesignerPage.designerWidget.threeJSEditorWidget.clickOnMenuItem("File", "Exit");
    materialDesignerPage.designerWidget.threeJSEditorWidget.waitForModalBackdropDisappear();
    materialDesignerPage.designerWidget.waitForVisible();
    materialDesignerPage.designerWidget.waitForLoaderToDisappear();
});
