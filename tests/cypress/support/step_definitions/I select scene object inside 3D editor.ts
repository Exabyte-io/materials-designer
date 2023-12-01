import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I select scene object {string} inside 3D editor", (sceneObjectName: string) => {
    materialDesignerPage.designerWidget.threeJSEditorWidget.selectSceneObjectByName(
        sceneObjectName,
    );
});
