import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I see material designer page", () => {
    materialDesignerPage.designerWidget.waitForVisible();
    materialDesignerPage.designerWidget.waitForLoaderToDisappear();
});
