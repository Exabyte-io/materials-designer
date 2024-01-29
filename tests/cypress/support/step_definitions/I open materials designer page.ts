import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given("I open materials designer page", () => {
    new MaterialDesignerPage().open();
});
