import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I open multi-material 3D editor$/, function () {
        materialDesignerPage.designerWidget.headerMenu.selectMenuItemByNameAndItemNumber("View", 1);
    });
};
