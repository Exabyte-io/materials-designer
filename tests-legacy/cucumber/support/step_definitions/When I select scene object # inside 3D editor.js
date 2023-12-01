import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I select scene object "([^"]*)" inside 3D editor$/, (sceneObjectName) => {
        materialDesignerPage.designerWidget.threeJSEditorWidget.selectSceneObjectByName(
            sceneObjectName,
        );
    });
}
