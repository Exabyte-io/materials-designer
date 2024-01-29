import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I clone material at index {string}", (index: string) => {
    const { itemsList, headerMenu } = new MaterialDesignerPage().designerWidget;
    itemsList.selectItemByIndex(parseInt(index, 10));
    headerMenu.selectMenuItemByNameAndItemNumber("Edit", 4);
});
