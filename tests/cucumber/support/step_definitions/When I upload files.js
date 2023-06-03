import { parseTable } from "../utils/table";
import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I upload files$/, function (table) {
        const filenames = parseTable(table, this);
        materialDesignerPage.designerWidget.defaultImportModalDialog.uploadFiles(filenames);
    });
}
