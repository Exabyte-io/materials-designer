import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I click the Run button$/, () => {
        materialDesignerPage.designerWidget.pythonTransformationDialog.run();
    });
}
