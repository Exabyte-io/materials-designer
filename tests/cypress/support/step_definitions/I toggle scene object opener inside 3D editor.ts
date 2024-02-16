import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I toggle scene object {string} opener inside 3D editor", (sceneObjectName: string) => {
    new MaterialDesignerPage().designerWidget.threeJSEditorWidget.toggleSceneObjectOpener(
        sceneObjectName,
    );
});
