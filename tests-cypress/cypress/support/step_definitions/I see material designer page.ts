import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I see material designer page", function () {
    materialDesignerPage.designerWidget.waitForVisible();
    materialDesignerPage.designerWidget.waitForLoaderToDisappear();
});
