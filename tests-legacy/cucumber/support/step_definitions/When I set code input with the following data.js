import { SELECTORS } from "../selectors";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I set code input with the following data:$/, (docString) => {
        const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
        const editorId = SELECTORS.headerMenu.pythonTransformationDialog.codeInput(0);
        pythonTransformationDialog.setCodeMirrorContent(editorId, docString);
    });
}
