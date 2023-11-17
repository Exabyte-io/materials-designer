import { SELECTORS } from "../selectors";
import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I set input with the following data$/, function (table) {
        const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
        const editorId = SELECTORS.headerMenu.pythonTransformationDialog.codeInput;
        const rows = parseTable(table, this);
        pythonTransformationDialog.setCodeMirrorContent(editorId, rows);
    });
}
