import path from "path";

import { SELECTORS } from "../selectors";
import { readFileSync } from "../utils/file";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I set code input from the file "(.*)"$/, (file) => {
        const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
        const editorId = SELECTORS.headerMenu.pythonTransformationDialog.codeInput;
        const content = readFileSync(path.resolve(__dirname, "../../fixtures", file));
        pythonTransformationDialog.setCodeMirrorContent(editorId, content);
    });
}
