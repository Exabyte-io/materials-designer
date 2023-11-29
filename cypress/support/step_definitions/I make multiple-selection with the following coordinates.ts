import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";

import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Coordinates } from "../widgets/ThreeJSEditorWidget";

Given("I make multiple-selection with the following coordinates:", (table: DataTable) => {
    const coordinates = parseTable<Coordinates>(table)[0];
    materialDesignerPage.designerWidget.threeJSEditorWidget.makeMultipleSelection(coordinates);
});
