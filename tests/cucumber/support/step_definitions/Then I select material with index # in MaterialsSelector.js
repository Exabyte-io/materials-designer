import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I select material with index "([^"]*)" in MaterialsSelector$/, (index) => {
        materialDesignerPage.designerWidget.pythonTransformationDialog.selectMaterialByIndex(index);
    });
}
