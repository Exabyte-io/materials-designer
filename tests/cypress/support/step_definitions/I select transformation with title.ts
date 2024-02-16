import { When } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

When("I select transformation with title {string}", (title: string) => {
    new MaterialDesignerPage().designerWidget.pythonTransformationDialog.selectTransformationByTitle(
        title,
    );
});
