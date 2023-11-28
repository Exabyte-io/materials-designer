import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "../utils/table";

Given("I set position of scene object with the following data:", function (table: DataTable) {
    const config = parseTable(table)[0];
    materialDesignerPage.designerWidget.threeJSEditorWidget.setSceneObjectPosition([
        config.x,
        config.y,
        config.z,
    ]);

});
