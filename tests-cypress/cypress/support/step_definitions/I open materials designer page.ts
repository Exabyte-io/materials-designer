import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I open materials designer page", () => {
    materialDesignerPage.open("/");
});
