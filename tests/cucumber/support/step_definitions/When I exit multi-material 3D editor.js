import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I exit multi-material 3D editor$/, function () {
        exabrowser.keys("Escape");
        materialDesignerPage.designerWidget.threeJSEditorWidget.waitForModalBackdropDisappear();
        materialDesignerPage.designerWidget.headerMenu.waitForVisible();
    });
};
