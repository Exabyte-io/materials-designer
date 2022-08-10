import path from "path";

import {parseTable} from "../utils/table";
import {readFileSync} from "../utils/file";
import {retry, shallowDeepAlmostEqual} from "../utils";

export default function () {
    this.Then(/^material with following data does not exist in state$/, function (table) {
        const config = parseTable(table, this)[0];
        const material = JSON.parse(readFileSync(path.resolve(__dirname, "../../fixtures", config.path)));
        retry(() => {
            const materials = exabrowser.execute(() => {
                return window.MDContainer.store.getState().present.materials.map(m => m.toJSON());
            }).value;
            shallowDeepAlmostEqual(undefined, materials[config.index - 1]);
        }, {retries: 5});
    });
};
