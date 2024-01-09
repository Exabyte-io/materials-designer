import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I select {string} option from the Edit menu", (actionString: "undo" | "redo" | "reset") => {
    const map = { undo: 1, redo: 2, reset: 3 };
    const index = map[actionString];
    if (!index) throw new Error("I click # action from the Edit menu - index is undefined");
    new MaterialDesignerPage().designerWidget.clickUndoRedoReset(index);
});
