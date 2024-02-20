import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import BrowserManager from "@mat3ra/tede/src/js/cypress/BrowserManager";
import { shallowDeepAlmostEqual } from "@mat3ra/tede/src/js/cypress/utils";
import { parseTable } from "@mat3ra/tede/src/js/cypress/utils/table";

import { getMaterialFromStandata } from "../utils/standata";

interface Params {
    path?: string;
    standata?: string;
    index: number;
}

Given("material with following data exists in state", (table: DataTable) => {
    const config = parseTable<Params>(table)[0];

    const assertMaterialExists = (material) => {
        BrowserManager.getBrowser()
            .execute((win) => {
                return win.MDContainer.store.getState().present.materials.map((m) => m.toJSON());
            })
            .then((materials) => {
                // TODO: fix toJSON() method in made.js to return basis.elements array with index starting from 1
                materials = materials.map((material, index) => {
                    if (material.basis && material.basis.elements) {
                        material.basis.elements = material.basis.elements.map((element, i) => {
                            return { ...element, index: i + 1 };
                        });
                    }
                    return material;
                });
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
