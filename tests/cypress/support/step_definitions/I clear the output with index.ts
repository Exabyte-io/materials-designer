import { When } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

When("I clear the output with index {string}", (index: string) => {
    new MaterialDesignerPage().designerWidget.pythonTransformationDialog.clearOutput(
        parseInt(index, 10),
    );
});
