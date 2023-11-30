import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";

import browser from "../browser";
import { shallowDeepAlmostEqual } from "../utils";
import { parseTable } from "../utils/table";

interface Params {
    path: string;
    index: number;
}

Given("material with following data exists in state", (table: DataTable) => {
    const config = parseTable<Params>(table)[0];
    cy.readFile(`./cypress/fixtures/${config.path}`).then((material) => {
        return browser
            .execute((win) => {
                return win.MDContainer.store.getState().present.materials.map((m) => m.toJSON());
            })
            .then((materials) => {
                shallowDeepAlmostEqual(material, materials[config.index - 1]);
            });
    });
});
