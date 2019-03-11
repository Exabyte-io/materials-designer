import {retry} from "../utils";
import {Widget} from "../widget";
import {logger} from "../logger";
import {SETTINGS} from "../settings";
import {SELECTORS} from "../selectors";
import {ItemsListWidget} from "./items_list_widget";
import {SAlertWidget} from "./alert/s_alert_widget";
import {HeaderMenuWidget} from "./header_menu_widget";
import {SaveDialogWidget} from "./dialogs/save_dialog";
import {SourceEditorWidget} from "./source_editor_widget";
import {SurfaceDialogWidget} from "./dialogs/surface_dialog";
import {SupercellDialogWidget} from "./dialogs/supercell_dialog";
import {InterpolatedSetDialogWidget} from "./dialogs/interpolated_set_dialog";

export class MaterialDesignerWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.sAlertWidget = new SAlertWidget(SELECTORS.sAlertWidget.wrapper);
        this.headerMenu = new HeaderMenuWidget(SELECTORS.materialDesignerWidget.headerMenu.wrapper);
        this.itemsList = new ItemsListWidget(SELECTORS.materialDesignerWidget.itemsList.wrapper);
        this.sourceEditor = new SourceEditorWidget(SELECTORS.materialDesignerWidget.sourceEditor.wrapper);

        this.saveDialog = new SaveDialogWidget(SELECTORS.materialDesignerWidget.headerMenu.saveDialog.wrapper);
        this.supercellDialog = new SupercellDialogWidget(
            SELECTORS.materialDesignerWidget.headerMenu.supercellDialog.wrapper
        );
        this.surfaceDialog = new SurfaceDialogWidget(SELECTORS.materialDesignerWidget.headerMenu.surfaceDialog.wrapper);
        this.interpolatedSetDialog = new InterpolatedSetDialogWidget(
            SELECTORS.materialDesignerWidget.headerMenu.interpolatedSetDialog.wrapper
        );

    }

    openSupercellDialog() {this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 1)}

    openSaveDialog() {this.headerMenu.selectMenuItemByNameAndItemNumber("Input/Output", 3)}

    openImportModal() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Input/Output", 1);
        this.importMaterialsExplorer.waitForVisible();
        this.importMaterialsExplorer.waitForLoaderToDisappear();

    }

    generateSupercell(supercellMatrixAsString) {
        this.openSupercellDialog();
        this.supercellDialog.generateSupercell(supercellMatrixAsString);
        this.supercellDialog.submit()
    }

    cloneCurrentMaterial() {this.headerMenu.selectMenuItemByNameAndItemNumber("Edit", 4)};

    save({tags = "", isPublic = undefined, saveAll = false}) {
        this.sAlertWidget.closeAllSuccess();
        this.openSaveDialog();
        this.saveDialog.setTags(tags);
        this.saveDialog.setIsPublic(isPublic);
        this.saveDialog.setSaveAll(saveAll);
        this.saveDialog.submit();
        this.waitForAlertSuccessToBeShown();
    }

    openSurfaceDialog() {this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 4)}

    createSurface(config) {
        this.openSurfaceDialog();
        this.surfaceDialog.generateSurface(config);
        this.surfaceDialog.submit()
    }

    openInterpolateSetDialog() {this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 3)}

    generateInterpolatedSet(nImages) {
        this.openInterpolateSetDialog();
        this.interpolatedSetDialog.setInterpolatedSetImagesCount(nImages);
        this.interpolatedSetDialog.submit();
    }

    waitForAlertSuccessToBeShown() {
        retry(() => {
            if (this.sweetAlertConfirmWidget.isVisible()) {
                this.sweetAlertConfirmWidget.confirm();
                logger.debug('Closed sweetAlert');
            } else if (this.sAlertWidget.isVisibleSuccess()) {
                logger.debug('Save material(s) successful');
                this.sAlertWidget.close();
                return;
            }
            logger.debug(this.sAlertWidget.getAlertSelectorByType("success"));
            throw ("Waiting for alert to be shown on material creation");
        });
    }

    exit() {this.headerMenu.selectMenuItemByNameAndItemNumber("Input/Output", 4)};

    /*
     * @summary Sets material parameters in UI
     * @params config.name {String} Material name
     * @params config.basis {String} Basis as string (text)
     * @params config.lattice {String} Lattice as JSON string
     * @params config.supercell {String} Supercell configuration as an array string
     */
    _setMaterialParametersFromConfig(materialCSSIndex, {name, basis, lattice, supercell}) {
        this.itemsList.selectItemByIndex(materialCSSIndex);
        name && this.itemsList.setItemName(materialCSSIndex, name);
        lattice && this.sourceEditor.latticeEditor.setLattice(JSON.parse(lattice));
        basis && this.sourceEditor.basisEditor.setBasis(basis);
        supercell && this.generateSupercell(supercell);
    }

    /*
     * @summary Creates multiple materials as follows:
     *          - clone the default material multiple times
     *          - remove default material
     *          - setup parameters for each new material
     *          - save all materials at once
     * @params configs {Array} List of configs per each material containing the information to be used on creation
     */
    createMultipleMaterials(configs) {
        configs.forEach(row => this.cloneCurrentMaterial());
        this.itemsList.deleteMaterialByIndex(1);

        configs.forEach((config, index) => {
            const itemCSSIndex = index + 1;
            this._setMaterialParametersFromConfig(itemCSSIndex, config);
        });

        // NOTE: take tags, isPublic from the first material only
        const tags = configs[0].tags || "";
        const isPublic = (!["false", undefined].includes(configs[0].isPublic));

        this.save({
            tags,
            isPublic,
            saveAll: true,
        });
    }

}
