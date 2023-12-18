import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I select transformation with title {string}", (title: string) => {
    materialDesignerPage.designerWidget.pythonTransformationDialog.selectTransformationByTitle(
        title,
    );
});
