import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I toggle scene object {string} opener inside 3D editor", function (sceneObjectName: string) {
    materialDesignerPage.designerWidget.threeJSEditorWidget.toggleSceneObjectOpener(
        sceneObjectName,
    );
});
