import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I set material basis and lattice with the following data:$/, function (table) {
        const config = parseTable(table, this)[0];
        const materialsDesigner = materialDesignerPage.designerWidget;
        materialsDesigner.sourceEditor.basisEditor.setBasis(config.basis);
        materialsDesigner.sourceEditor.latticeEditor.setLattice(JSON.parse(config.lattice));
    });
}
