import {parseTable} from "../utils/table";
import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.When(/^I make multiple-selection with the following coordinates:$/, function (table) {
        const coordinates = parseTable(table, this)[0];
        materialDesignerPage.designerWidget.threeJSEditorWidget.makeMultipleSelection(coordinates);
    });
}
