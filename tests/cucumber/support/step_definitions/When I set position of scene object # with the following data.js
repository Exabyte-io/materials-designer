import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I set position of scene object with the following data:$/, function (table) {
        const config = parseTable(table, this)[0];
        materialDesignerPage
            .designerWidget
            .threeJSEditorWidget
            .setSceneObjectPosition([config.x, config.y, config.z]);
    });
}
