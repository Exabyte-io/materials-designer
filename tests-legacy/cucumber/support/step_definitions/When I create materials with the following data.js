import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I create materials with the following data$/, function (table) {
        const materialsDesigner = materialDesignerPage.designerWidget;
        const rows = parseTable(table, this);
        materialsDesigner.createMultipleMaterials(rows);
    });
}
