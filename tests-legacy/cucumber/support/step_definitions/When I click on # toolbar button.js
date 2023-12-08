import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I click on "([^"]*)" toolbar button$/, (title) => {
        materialDesignerPage.designerWidget.threeJSEditorWidget.clickOnToolbarButton(title);
    });
}
