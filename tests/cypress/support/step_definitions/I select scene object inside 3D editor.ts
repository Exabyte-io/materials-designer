import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I select scene object {string} inside 3D editor", (sceneObjectName: string) => {
    new MaterialDesignerPage().designerWidget.threeJSEditorWidget.selectSceneObjectByName(
        sceneObjectName,
    );
});
