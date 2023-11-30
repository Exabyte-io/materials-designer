import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";

import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

interface BasisAndLatice {
    basis: string;
    lattice: string;
}

Given("I set material basis and lattice with the following data:", (table: DataTable) => {
    const { basis, lattice } = parseTable<BasisAndLatice>(table, this)[0];
    const { basisEditor, latticeEditor } = materialDesignerPage.designerWidget.sourceEditor;

    basisEditor.setBasis(basis);
    latticeEditor.setLattice(JSON.parse(lattice));
});
