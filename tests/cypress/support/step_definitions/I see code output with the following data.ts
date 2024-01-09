import { Then } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Then("I see code output {string} with the following data", (id: number, docString: string) => {
    const { pythonTransformationDialog } = new MaterialDesignerPage().designerWidget;
    pythonTransformationDialog.getCode(id).then((actualContent: string) => {
        expect(docString.replace(/\s/g, "")).to.equal(actualContent.replace(/\s/g, ""));
    });
});
