import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I select {string} option from the Edit menu", function (actionString: "undo" | "redo" | "reset") {
    const map = { undo: 1, redo: 2, reset: 3 };
    const index = map[actionString];
    if (!index) throw new Error("I click # action from the Edit menu - index is undefined");
    materialDesignerPage.designerWidget.clickUndoRedoReset(index);
});
