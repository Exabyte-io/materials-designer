import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I select transformation with title "([^"]*)"$/, (title) => {
        materialDesignerPage.designerWidget.pythonTransformationDialog.selectDropdownItemByTitle(
            title,
        );
    });
}
