import path from "path";

import { retry, shallowDeepAlmostEqual } from "../utils";
import { readFileSync } from "../utils/file";
import { parseTable } from "../utils/table";

export default function () {
    this.Then(/^material with following data exists in state$/, function (table) {
        const config = parseTable(table, this)[0];
        const material = JSON.parse(readFileSync(path.resolve(__dirname, "../../fixtures", config.path)));
        retry(() => {
            const materials = exabrowser.execute(() => {
                return window.MDContainer.store.getState().present.materials.map((m) => m.toJSON());
            }).value;
            shallowDeepAlmostEqual(material, materials[config.index - 1]);
        }, { retries: 5 });
    });
}
