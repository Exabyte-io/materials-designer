import MaterialDesignerWidget from "./MaterialDesignerWidget";
import Page from "./Page";

const wrapper = "#materials-designer";

export default class MaterialDesignerPage extends Page {
    designerWidget: MaterialDesignerWidget;

    constructor() {
        super(wrapper);
        this.designerWidget = new MaterialDesignerWidget(wrapper);
    }
}
