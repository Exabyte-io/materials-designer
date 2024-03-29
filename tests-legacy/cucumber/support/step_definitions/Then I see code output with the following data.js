import { deepEqual } from "assert";

import { SELECTORS } from "../selectors";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see code output with the following data:$/, (docString) => {
        const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
        const editorId = SELECTORS.headerMenu.pythonTransformationDialog.pythonOutput(0);
        const content = pythonTransformationDialog.getCodeMirrorContent(editorId);
        deepEqual(content.trim(), docString);
    });
}
