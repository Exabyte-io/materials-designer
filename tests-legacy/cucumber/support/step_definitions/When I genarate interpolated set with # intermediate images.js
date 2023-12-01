import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I generate interpolated set with "([^"]*)" intermediate images$/, (nImages) => {
        materialDesignerPage.designerWidget.generateInterpolatedSet(parseInt(nImages));
    });
}
