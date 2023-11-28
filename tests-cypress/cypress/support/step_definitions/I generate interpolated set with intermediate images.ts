import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I generate interpolated set with {string} intermediate images", function (nImages: string) {
    materialDesignerPage.designerWidget.generateInterpolatedSet(parseInt(nImages));
});
