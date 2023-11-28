import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I clone material at index {string}", (index: string) => {
    cy.log("index", index);
    const {itemsList, headerMenu}= materialDesignerPage.designerWidget;
    itemsList.selectItemByIndex(parseInt(index)).then(() => {
        headerMenu.selectMenuItemByNameAndItemNumber("Edit", 4);
    });
});
