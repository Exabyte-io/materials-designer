import { deepEqual } from "assert";

import { SELECTORS } from "../selectors";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see code input with the following data:$/, (docString) => {
        const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
        const editorId = SELECTORS.headerMenu.pythonTransformationDialog.codeInput;
        const content = pythonTransformationDialog.getCodeMirrorContent(editorId);
        deepEqual(content, docString);
    });
}
