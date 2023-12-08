import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I click the Submit button$/, () => {
        materialDesignerPage.designerWidget.defaultImportModalDialog.submit();
    });
}
