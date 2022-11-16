import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I set name of material with index "([^"]*)" to "([^"]*)"$/, (index, name) => {
        materialDesignerPage.designerWidget.itemsList.setItemName(parseInt(index), name);
    });
}
