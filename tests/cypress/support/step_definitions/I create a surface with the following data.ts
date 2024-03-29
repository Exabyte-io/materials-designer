import { DataTable, Given } from "@badeball/cypress-cucumber-preprocessor";
import { parseTable } from "@mat3ra/tede/src/js/cypress/utils/table";

import MaterialDesignerPage from "../widgets/MaterialDesignerPage";
import { SurfaceConfig } from "../widgets/SurfaceDialogWidget";

Given("I create a surface with the following data:", (table: DataTable) => {
    const config = parseTable<SurfaceConfig>(table)[0];
    new MaterialDesignerPage().designerWidget.createSurface(config);
});
