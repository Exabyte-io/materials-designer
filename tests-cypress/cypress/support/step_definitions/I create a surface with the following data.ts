import { materialDesignerPage } from "../widgets/MaterialDesignerPage";
import { Given, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "../utils/table";
import { SurfaceConfig } from "../widgets/SurfaceDialogWidget";

Given("I create a surface with the following data:", (table: DataTable) => {
    const config = parseTable<SurfaceConfig>(table)[0];
    materialDesignerPage.designerWidget.createSurface(config);
});
