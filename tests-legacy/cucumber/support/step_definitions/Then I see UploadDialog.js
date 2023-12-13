import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see UploadDialog$/, () => {
        materialDesignerPage.designerWidget.defaultImportModalDialog.isVisible();
    });
}
