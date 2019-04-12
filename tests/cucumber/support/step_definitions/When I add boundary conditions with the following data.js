import {parseTable} from "../utils/table";
import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.When(/^I add boundary conditions with the following data:$/, function (table) {
        const config = parseTable(table, this)[0];
        materialDesignerPage.designerWidget.addBoundaryConditions(config);
    });
};
