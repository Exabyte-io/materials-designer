import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.When(/^I exit materials designer/, function () {
        materialDesignerPage.designerWidget.exit();
    });
};
