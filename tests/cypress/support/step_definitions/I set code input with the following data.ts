import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I set code input with the following data", (docString: string) => {
    materialDesignerPage.designerWidget.pythonTransformationDialog.setCode(docString);
});
