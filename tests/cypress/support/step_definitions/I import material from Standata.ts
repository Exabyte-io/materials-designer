import { When } from "@badeball/cypress-cucumber-preprocessor";

import { materialDesignerPage } from "../widgets/MaterialDesignerPage";

When("I import material {string} from Standata", (name: string) => {
    materialDesignerPage.designerWidget.standataDialog.selectMaterial(name);
    materialDesignerPage.designerWidget.standataDialog.submit();
});
