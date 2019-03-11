import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.When(/^I save all designer materials/, function () {
        materialDesignerPage.designerWidget.saveDialog.setSaveAll(true);
        materialDesignerPage.designerWidget.saveDialog.submit();
        materialDesignerPage.designerWidget.waitForAlertSuccessToBeShown();
    });
};
