import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.When(/^I delete materials with index "([^"]*)"$/, (index) => {
        if (!index)
            throw new Error("I click delete action from the Edit menu - index is undefined");
        materialDesignerPage.designerWidget.clickDeleteAction(index);
    });
}
