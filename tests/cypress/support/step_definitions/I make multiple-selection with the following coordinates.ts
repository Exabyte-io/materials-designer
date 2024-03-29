import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "@mat3ra/tede/src/js/cypress/utils/table";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";
import { Coordinates } from "../widgets/ThreeJSEditorWidget";

Given("I make multiple-selection with the following coordinates:", (table: DataTable) => {
    const coordinates = parseTable<Coordinates>(table)[0];
    new MaterialDesignerPage().designerWidget.threeJSEditorWidget.makeMultipleSelection(
        coordinates,
    );
});
