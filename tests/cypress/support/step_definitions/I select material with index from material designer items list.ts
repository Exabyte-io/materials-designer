import { Given } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

Given(
    "I select material with index {string} from material designer items list",
    (index: string) => {
        new MaterialDesignerPage().designerWidget.itemsList.selectItemByIndex(parseInt(index, 10));
    },
);
