import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I generate interpolated set with {string} intermediate images", (nImages: string) => {
    new MaterialDesignerPage().designerWidget.generateInterpolatedSet(parseInt(nImages, 10));
});
