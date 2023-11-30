import MaterialDesignerWidget from "./MaterialDesignerWidget";
import Page from "./Page";

const wrapper = "#materials-designer";

export class MaterialDesignerPage extends Page {
    designerWidget: MaterialDesignerWidget;

    constructor(selector: string) {
        super(selector);
        this.designerWidget = new MaterialDesignerWidget(wrapper);
    }
}

export const materialDesignerPage = new MaterialDesignerPage(wrapper);
