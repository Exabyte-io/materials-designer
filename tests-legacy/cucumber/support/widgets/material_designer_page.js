import { Page } from "../page";
import { SELECTORS } from "../selectors";
import { MaterialDesignerWidget } from "./material_designer_widget";

export class MaterialDesignerPage extends Page {
    constructor(selector) {
        super(selector);
        this.designerWidget = new MaterialDesignerWidget(SELECTORS.wrapper);
    }
}

export const materialDesignerPage = new MaterialDesignerPage(SELECTORS.wrapper);
