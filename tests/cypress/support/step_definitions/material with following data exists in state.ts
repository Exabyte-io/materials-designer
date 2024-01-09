import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";

import browser from "../browser";
import { shallowDeepAlmostEqual } from "../utils";
import { getMaterialFromStandata } from "../utils/standata";
import { parseTable } from "../utils/table";

interface Params {
    path?: string;
    standata?: string;
    index: number;
}

Given("material with following data exists in state", (table: DataTable) => {
    const config = parseTable<Params>(table)[0];

    const assertMaterialExists = (material) => {
        browser
            .execute((win) => {
                return win.MDContainer.store.getState().present.materials.map((m) => m.toJSON());
            })
            .then((materials) => {
                shallowDeepAlmostEqual(material, materials[config.index - 1]);
            });
    };

    if (config.standata) {
        const materialName = config.standata;
        cy.wrap(getMaterialFromStandata(materialName)).then(assertMaterialExists);
    } else if (config.path) {
        cy.readFile(`./cypress/fixtures/${config.path}`).then(assertMaterialExists);
    } else {
        throw new Error("No valid material source specified in the data table.");
    }
});
