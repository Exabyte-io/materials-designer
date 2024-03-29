import { deepEqual } from "assert";
import path from "path";

import { SELECTORS } from "../selectors";
import { readFileSync } from "../utils/file";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see code output with the data from the file "(.*)"$/, (file) => {
        const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
        const editorId = SELECTORS.headerMenu.pythonTransformationDialog.pythonOutput(0);
        const expectedContent = readFileSync(path.resolve(__dirname, "../../fixtures", file));
        exabrowser.safelyScroll(SELECTORS.headerMenu.pythonTransformationDialog.dialog);
        exabrowser.waitForVisible(`#${editorId}`, 20000);
        const content = pythonTransformationDialog.getCodeMirrorContent(editorId);
        deepEqual(content.replace(/\s/g, ""), expectedContent.replace(/\s/g, ""));
    });
}
