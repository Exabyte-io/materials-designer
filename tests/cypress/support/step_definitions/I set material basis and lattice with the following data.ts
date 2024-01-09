import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "@exabyte-io/code.js/dist/cypress/utils/table";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

interface BasisAndLatice {
    basis: string;
    lattice: string;
}

Given("I set material basis and lattice with the following data:", (table: DataTable) => {
    const { basis, lattice } = parseTable<BasisAndLatice>(table)[0];
    const { basisEditor, latticeEditor } = new MaterialDesignerPage().designerWidget.sourceEditor;

    basisEditor.setBasis(basis);
    latticeEditor.setLattice(JSON.parse(lattice));
});
