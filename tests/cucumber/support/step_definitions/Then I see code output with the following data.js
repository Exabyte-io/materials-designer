import expect from "expect";

import { SELECTORS } from "../selectors";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see code output with the following data:$/, (docString) => {
        const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
        const editorId = SELECTORS.headerMenu.pythonTransformationDialog.pythonOutput;
        const content = pythonTransformationDialog.getCodeMirrorContent(editorId);
        console.log("X:", content);
        console.log("X:", docString);
        expect(content.trim()).toEqual(docString);
    });
}
