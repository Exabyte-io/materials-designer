import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I cancel import$/, () => {
        materialDesignerPage.designerWidget.defaultImportModalDialog.cancel();
    });
}
