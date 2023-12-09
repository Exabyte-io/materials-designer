import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I clear the output with index "([^"]*)"$/, (index) => {
        materialDesignerPage.designerWidget.pythonTransformationDialog.clearOutput(index);
    });
}
