import { Then } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Then("I see code output with the following data", (docString: string) => {
    const { pythonTransformationDialog } = materialDesignerPage.designerWidget;
    pythonTransformationDialog.getCode(0).then((actualContent: string) => {
        expect(docString.trim()).to.equal(actualContent.trim());
    });
});
