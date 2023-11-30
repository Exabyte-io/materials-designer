import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

Given(
    "I select material with index {string} from material designer items list",
    (index: string) => {
        materialDesignerPage.designerWidget.itemsList.selectItemByIndex(parseInt(index, 10));
    },
);
