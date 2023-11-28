import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I select material with index {string} from material designer items list", function (index: string) {
    materialDesignerPage.designerWidget.itemsList.selectItemByIndex(parseInt(index));
});
