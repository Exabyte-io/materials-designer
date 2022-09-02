import {Widget} from "../widget";
import {SELECTORS} from "../selectors";
import {ItemsListWidget} from "./items_list_widget";
import {SAlertWidget} from "./alert/s_alert_widget";
import {HeaderMenuWidget} from "./header_menu_widget";
import {SourceEditorWidget} from "./source_editor_widget";
import {ThreeJSEditorWidget} from "./threejs_editor_widget";
import {SurfaceDialogWidget} from "./dialogs/surface_dialog";
import {SupercellDialogWidget} from "./dialogs/supercell_dialog";
import {InterpolatedSetDialogWidget} from "./dialogs/interpolated_set_dialog";
import {BoundaryConditionsDialogWidget} from "./dialogs/boundary_conditions_dialog";

export class MaterialDesignerWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.itemsList = new ItemsListWidget(SELECTORS.itemsList.wrapper);
        this.sAlertWidget = new SAlertWidget(SELECTORS.sAlertWidget.wrapper);
        this.headerMenu = new HeaderMenuWidget(SELECTORS.headerMenu.wrapper);
        this.sourceEditor = new SourceEditorWidget(SELECTORS.sourceEditor.wrapper);
        this.surfaceDialog = new SurfaceDialogWidget(SELECTORS.headerMenu.surfaceDialog.wrapper);
        this.supercellDialog = new SupercellDialogWidget(SELECTORS.headerMenu.supercellDialog.wrapper);
        this.interpolatedSetDialog = new InterpolatedSetDialogWidget(SELECTORS.headerMenu.interpolatedSetDialog.wrapper);
        this.threeJSEditorWidget = new ThreeJSEditorWidget(SELECTORS.threeJSEditorWidget.wrapper);
        this.boundaryConditionsDialog = new BoundaryConditionsDialogWidget(SELECTORS.headerMenu.boundaryConditionsDialog.wrapper);
    }

    openSupercellDialog() {this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 1)}

    openSaveDialog() {this.headerMenu.selectMenuItemByNameAndItemNumber("Input/Output", 3)}

    openImportModal() {
    }

    save(config) {
    }

    exit() {
    }

    generateSupercell(supercellMatrixAsString) {
        this.openSupercellDialog();
        this.supercellDialog.generateSupercell(supercellMatrixAsString);
        this.supercellDialog.submit()
    }

    cloneCurrentMaterial() {this.headerMenu.selectMenuItemByNameAndItemNumber("Edit", 4)};

    clickDeleteAction(index) {
        this.itemsList.deleteMaterialByIndex(index);
    }

    clickUndoRedoReset(index = 1) {this.headerMenu.selectMenuItemByNameAndItemNumber("Edit", index)};

    openSurfaceDialog() {this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 4)}

    createSurface(config) {
        this.openSurfaceDialog();
        this.surfaceDialog.generateSurface(config);
        this.surfaceDialog.submit()
    }

    openBoundaryConditionsDialog() {this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 5)}

    addBoundaryConditions(config) {
        this.openBoundaryConditionsDialog();
        this.boundaryConditionsDialog.addBoundaryConditions(config);
        this.boundaryConditionsDialog.submit()
    }

    openInterpolateSetDialog() {this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 3)}

    generateInterpolatedSet(nImages) {
        this.openInterpolateSetDialog();
        this.interpolatedSetDialog.setInterpolatedSetImagesCount(nImages);
        this.interpolatedSetDialog.submit();
    }

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
     * @params configs {Array} List of configs per each material containing the information to be used on creation
     */
    createMultipleMaterials(configs) {
        configs.forEach(row => this.cloneCurrentMaterial());
        this.itemsList.deleteMaterialByIndex(1);

        configs.forEach((config, index) => {
            const itemCSSIndex = index + 1;
            this._setMaterialParametersFromConfig(itemCSSIndex, config);
        });
    }

}
