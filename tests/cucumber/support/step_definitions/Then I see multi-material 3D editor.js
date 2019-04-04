import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see multi-material 3D editor$/, function () {
        materialDesignerPage.designerWidget.threeJSEditorWidget.waitForLoaderToBeVisible();
        materialDesignerPage.designerWidget.threeJSEditorWidget.waitForLoaderToDisappear();
    });
};
