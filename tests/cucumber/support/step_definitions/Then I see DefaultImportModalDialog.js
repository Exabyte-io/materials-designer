import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see DefaultImportModalDialog$/, () => {
        materialDesignerPage.designerWidget.defaultImportModalDialog.isVisible();
    });
}
