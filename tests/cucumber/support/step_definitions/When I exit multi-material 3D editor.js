import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I exit multi-material 3D editor$/, function () {
        materialDesignerPage.designerWidget.threeJSEditorWidget.clickOnMenuItem("File", "Exit");
        materialDesignerPage.designerWidget.threeJSEditorWidget.waitForModalBackdropDisappear();
        materialDesignerPage.designerWidget.waitForVisible();
        materialDesignerPage.designerWidget.waitForLoaderToDisappear();
    });
};
