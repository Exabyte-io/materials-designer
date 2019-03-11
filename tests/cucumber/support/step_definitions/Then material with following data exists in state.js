import path from "path";

import {parseTable} from "../utils/table";
import {readFileSync} from "../utils/file";
import {shallowDeepAlmostEqual} from "../utils";

export default function () {
    this.Then(/^material with following data exists in state$/, function (table) {
        const config = parseTable(table, this)[0];
        const material = JSON.parse(readFileSync(path.resolve(__dirname, "../../fixtures", config.path)));
        const materials = exabrowser.execute(() => {
            return window.$r.store.getState().present.materials.map(m => m.toJSON());
        }).value;
        shallowDeepAlmostEqual(material, materials[config.index - 1]);
    });
};
