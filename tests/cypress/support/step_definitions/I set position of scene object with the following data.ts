import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "@exabyte-io/code.js/dist/cypress/utils/table";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

interface Position {
    x: string;
    y: string;
    z: string;
}

Given("I set position of scene object with the following data:", (table: DataTable) => {
    const config = parseTable<Position>(table)[0];
    new MaterialDesignerPage().designerWidget.threeJSEditorWidget.setSceneObjectPosition([
        config.x,
        config.y,
        config.z,
    ]);
});
