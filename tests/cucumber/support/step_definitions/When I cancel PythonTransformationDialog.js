import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I cancel PythonTransformationDialog$/, () => {
        materialDesignerPage.designerWidget.pythonTransformationDialog.cancel();
    });
}
