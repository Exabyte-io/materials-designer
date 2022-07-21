import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.When(/^I toggle scene object "([^"]*)" opener inside 3D editor$/, function (sceneObjectName) {
        console.log({ sceneObjectName });
        materialDesignerPage.designerWidget.threeJSEditorWidget.toggleSceneObjectOpener(sceneObjectName);
    });
}
