import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see the Add button$/, () => {
        materialDesignerPage.designerWidget.defaultImportModalDialog.addButtonExists();
    });
}
