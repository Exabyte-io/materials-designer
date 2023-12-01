import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given("I clone material at index {string}", (index: string) => {
    const { itemsList, headerMenu } = materialDesignerPage.designerWidget;
    itemsList.selectItemByIndex(parseInt(index, 10));
    headerMenu.selectMenuItemByNameAndItemNumber("Edit", 4);
});
