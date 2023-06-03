import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^the DefaultImportModalDialog should be closed$/, () => {
        materialDesignerPage.designerWidget.defaultImportModalDialog.waitForDisappear();
    });
}
