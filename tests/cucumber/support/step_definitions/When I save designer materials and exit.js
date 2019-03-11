import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.When(/^I save designer materials and exit$/, function () {
        materialDesignerPage.designerWidget.openSaveDialog();
        materialDesignerPage.designerWidget.saveDialog.submit();
        materialDesignerPage.designerWidget.waitForAlertSuccessToBeShown();
        materialDesignerPage.designerWidget.exit();
    });
};
