import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";

import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

interface Position {
    x: string;
    y: string;
    z: string;
}

Given("I set position of scene object with the following data:", (table: DataTable) => {
    const config = parseTable<Position>(table)[0];
    materialDesignerPage.designerWidget.threeJSEditorWidget.setSceneObjectPosition([
        config.x,
        config.y,
        config.z,
    ]);
});
