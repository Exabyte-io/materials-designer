import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "../utils/table";

Given("I make multiple-selection with the following coordinates:", function (table: DataTable) {
    const coordinates = parseTable(table)[0];
    materialDesignerPage.designerWidget.threeJSEditorWidget.makeMultipleSelection(coordinates);
});
