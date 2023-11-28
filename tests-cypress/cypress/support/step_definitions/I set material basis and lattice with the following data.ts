import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "../utils/table";


Given("I set material basis and lattice with the following data:", function (table: DataTable) {
    const { basis, lattice } = parseTable(table, this)[0];
    const { basisEditor, latticeEditor } = materialDesignerPage.designerWidget.sourceEditor;

    basisEditor.setBasis(basis);
    latticeEditor.setLattice(JSON.parse(lattice));
});
