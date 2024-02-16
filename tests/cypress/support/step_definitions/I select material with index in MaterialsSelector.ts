import { When } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

When("I select material with index {string} in MaterialsSelector", (index: string) => {
    new MaterialDesignerPage().designerWidget.pythonTransformationDialog.selectMaterial(
        parseInt(index, 10),
    );
});
