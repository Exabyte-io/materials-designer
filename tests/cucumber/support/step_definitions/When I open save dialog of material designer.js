import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.When(/^I open save dialog of material designer$/, function () {
        materialDesignerPage.designerWidget.openSaveDialog();
    });
};
