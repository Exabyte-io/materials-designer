import { Then } from "cypress-cucumber-preprocessor/steps";

import PythonTransformationDialogWidget from "../widgets/PythonTransformationDialogWidget";

Then("I see PythonTransformationDialog", () => {
    PythonTransformationDialogWidget.isVisible();
});
