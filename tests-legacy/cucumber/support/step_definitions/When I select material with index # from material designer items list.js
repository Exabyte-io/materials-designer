import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    // eslint-disable-next-line max-len
    this.Then(
        /^I select material with index "([^"]*)" from material designer items list$/,
        (index) => {
            materialDesignerPage.designerWidget.itemsList.selectItemByIndex(parseInt(index));
        },
    );
}
