import { Given, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "../utils/table";
import browser from "../browser";
import { shallowDeepAlmostEqual } from "../utils";


Given("material with following data exists in state", (table: DataTable) => {
    const config = parseTable(table)[0];
    cy.readFile(`./cypress/fixtures/${config.path}`).then((material) => {
        return browser.execute((win) => {
            return win.MDContainer.store
                .getState()
                .present.materials.map((m) => m.toJSON());
        }).then((materials) => {
            shallowDeepAlmostEqual(material, materials[config.index - 1]);
        });
    });
});
