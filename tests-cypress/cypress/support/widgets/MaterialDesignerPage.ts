import Page from "./Page";
// import { SELECTORS } from "../selectors";
import MaterialDesignerWidget from "./MaterialDesignerWidget";

export class MaterialDesignerPage extends Page {
    designerWidget: MaterialDesignerWidget;
    
    constructor(selector: string) {
        super(selector);
        this.designerWidget = new MaterialDesignerWidget("test");
    }
}

export const materialDesignerPage = new MaterialDesignerPage("test");
