/* eslint-disable class-methods-use-this */
import Widget from "./Widget";
import HeaderMenuWidget from "./HeaderMenuWidget";
import SurfaceDialogWidget, { SurfaceConfig } from "./SurfaceDialogWidget";


export default class MaterialDesignerWidget extends Widget {
    headerMenu: HeaderMenuWidget;

    surfaceDialog: SurfaceDialogWidget

    constructor(selector: string) {
        super(selector);
        this.headerMenu = new HeaderMenuWidget("test");
        this.surfaceDialog = new SurfaceDialogWidget("test");
    }

    ///
    openSurfaceDialog() {
        this.headerMenu.clickOnMenuItem("Advanced", "Surface / slab");
    }

    ///
    createSurface(config: SurfaceConfig) {
        this.openSurfaceDialog();
        this.surfaceDialog.generateSurface(config);
        // this.surfaceDialog.submit();
    }

    
}
