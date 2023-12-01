import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I open multi-material 3D editor$/, () => {
        materialDesignerPage.designerWidget.headerMenu.selectMenuItemByNameAndItemNumber("View", 1);
        materialDesignerPage.designerWidget.threeJSEditorWidget.waitForLoaderToDisappear();
    });
}
