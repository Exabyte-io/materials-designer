import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I click the Remove button for a file$/, function (table) {
        const file = parseTable(table, this)[0];
        materialDesignerPage.designerWidget.defaultImportModalDialog.removeFile(file);
    });
}
