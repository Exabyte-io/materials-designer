import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";

import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

interface Position {
    x: number;
    y: number;
    z: number;
}

Given("I see that scene object has the following position:", (table: DataTable) => {
    const config = parseTable<Position>(table)[0];

    materialDesignerPage.designerWidget.threeJSEditorWidget.validateSceneObjectPosition([
        config.x,
        config.y,
        config.z,
    ]);
});
