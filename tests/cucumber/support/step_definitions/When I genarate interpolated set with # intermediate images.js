import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.When(/^I generate interpolated set with "([^"]*)" intermediate images$/, function (nImages) {
        materialDesignerPage.designerWidget.generateInterpolatedSet(parseInt(nImages));
    });
};
