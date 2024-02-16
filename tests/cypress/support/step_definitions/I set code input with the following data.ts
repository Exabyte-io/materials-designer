import { When } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

When("I set code input with the following data", (docString: string) => {
    new MaterialDesignerPage().designerWidget.pythonTransformationDialog.setCode(docString);
});
