import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I select material with index {int} in MaterialsSelector", (index: number) => {
    materialDesignerPage.designerWidget.pythonTransformationDialog.selectMaterial(index);
});
