import { Then } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Then("I see code output {string} with the following data", (id: number, docString: string) => {
    const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
    pythonTransformationDialog.getCode(id).then((actualContent: string) => {
        expect(docString.trim()).to.equal(actualContent.trim());
    });
});
