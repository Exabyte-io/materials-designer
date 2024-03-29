import { materialDesignerPage } from "../widgets/material_designer_page";

export default function () {
    this.Then(/^I select "([^"]*)" option from the Edit menu$/, (actionString) => {
        const map = { undo: 1, redo: 2, reset: 3 };
        const index = map[actionString];
        if (!index) throw new Error("I click # action from the Edit menu - index is undefined");
        materialDesignerPage.designerWidget.clickUndoRedoReset(index);
    });
}
