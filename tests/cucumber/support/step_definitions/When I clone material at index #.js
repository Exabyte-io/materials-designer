import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I clone material at index "([^"]*)"$/, function (index) {
        materialDesignerPage.designerWidget.itemsList.selectItemByIndex(parseInt(index));
        materialDesignerPage.designerWidget.headerMenu.selectMenuItemByNameAndItemNumber("Edit", 4);
    });
};
