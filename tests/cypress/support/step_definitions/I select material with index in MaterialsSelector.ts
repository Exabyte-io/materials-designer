import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I select material with index {string} in MaterialsSelector", (index: string) => {
    materialDesignerPage.designerWidget.pythonTransformationDialog.selectMaterial(
        parseInt(index, 10),
    );
});
