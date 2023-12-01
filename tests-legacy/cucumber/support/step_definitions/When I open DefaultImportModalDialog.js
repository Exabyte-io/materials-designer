import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I open DefaultImportModalDialog/, () => {
        materialDesignerPage.designerWidget.headerMenu.selectMenuItemByNameAndItemNumber(
            "Input/Output",
            1,
        );
    });
}
