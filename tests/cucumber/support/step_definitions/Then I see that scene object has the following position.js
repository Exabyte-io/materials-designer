import assert from "assert";
import isEqual from "lodash/isEqual";
import {parseTable} from "../utils/table";
import {materialDesignerPage} from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see that scene object has the following position:$/, function (table) {
        const config = parseTable(table, this)[0];
        const expectedPosition = [config.x, config.y, config.z];
        const sceneObjectPosition =
            materialDesignerPage.designerWidget.threeJSEditorWidget.getSceneObjectPosition();

        assert(isEqual(sceneObjectPosition, expectedPosition));
    });
}
