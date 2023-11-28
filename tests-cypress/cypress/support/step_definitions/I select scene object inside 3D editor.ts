import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";


Given("I select scene object {string} inside 3D editor", function (sceneObjectName: string) {
    materialDesignerPage.designerWidget.threeJSEditorWidget.selectSceneObjectByName(
        sceneObjectName,
    );
});
