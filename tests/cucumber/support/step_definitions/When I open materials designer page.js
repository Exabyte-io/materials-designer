import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.When(/^I open materials designer page/, function () {
        materialDesignerPage.open();
    });
};
