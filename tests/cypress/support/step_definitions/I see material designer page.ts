import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I see material designer page", () => {
    const page = new MaterialDesignerPage();
    page.designerWidget.waitForVisible();
    page.designerWidget.waitForLoaderToDisappear();
});
