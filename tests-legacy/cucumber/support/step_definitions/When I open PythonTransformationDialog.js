import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I open PythonTransformationDialog$/, () => {
        materialDesignerPage.designerWidget.headerMenu.selectMenuItemByNameAndItemNumber(
            "Advanced",
            6,
        );
    });
}
