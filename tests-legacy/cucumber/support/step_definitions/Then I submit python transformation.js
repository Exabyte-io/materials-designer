import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I submit python transformation$/, () => {
        materialDesignerPage.designerWidget.pythonTransformationDialog.submit();
    });
}
