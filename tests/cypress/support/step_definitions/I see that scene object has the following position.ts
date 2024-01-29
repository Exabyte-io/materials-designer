import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "@mat3ra/tede/src/js/cypress/utils/table";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

interface Position {
    x: number;
    y: number;
    z: number;
}

Given("I see that scene object has the following position:", (table: DataTable) => {
    const config = parseTable<Position>(table)[0];

    new MaterialDesignerPage().designerWidget.threeJSEditorWidget.validateSceneObjectPosition([
        config.x,
        config.y,
        config.z,
    ]);
});
