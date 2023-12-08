import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I toggle scene object {string} opener inside 3D editor", (sceneObjectName: string) => {
    materialDesignerPage.designerWidget.threeJSEditorWidget.toggleSceneObjectOpener(
        sceneObjectName,
    );
});
