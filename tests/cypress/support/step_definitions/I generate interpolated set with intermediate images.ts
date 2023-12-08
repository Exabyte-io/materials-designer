import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I generate interpolated set with {string} intermediate images", (nImages: string) => {
    materialDesignerPage.designerWidget.generateInterpolatedSet(parseInt(nImages, 10));
});
