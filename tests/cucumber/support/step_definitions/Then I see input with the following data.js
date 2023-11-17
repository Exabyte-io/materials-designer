import { SELECTORS } from "../selectors";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I see input with the following data$/, (docString) => {
        const editorId = SELECTORS.headerMenu.pythonTransformationDialog.codeInput;
        const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
        const content = pythonTransformationDialog.getCodeMirrorContent(editorId);
        console.log(content);
    });
}
