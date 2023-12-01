import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see material designer page$/, () => {
        materialDesignerPage.designerWidget.waitForVisible();
        materialDesignerPage.designerWidget.waitForLoaderToDisappear();
    });
}
