import { When } from "@badeball/cypress-cucumber-preprocessor";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";

When("I import material {string} from Standata", (name: string) => {
    const materialDesignerPage = new MaterialDesignerPage();
    materialDesignerPage.designerWidget.standataDialog.selectMaterial(name);
    materialDesignerPage.designerWidget.standataDialog.submit();
});
