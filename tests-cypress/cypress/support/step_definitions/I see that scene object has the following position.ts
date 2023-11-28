import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "../utils/table";

Given("I see that scene object has the following position:", function (table: DataTable) {
    const config = parseTable(table)[0];

    materialDesignerPage.designerWidget.threeJSEditorWidget.validateSceneObjectPosition([config.x, config.y, config.z]);
});
