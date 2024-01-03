/* eslint-disable class-methods-use-this */
import { SELECTORS } from "../selectors";
import { Widget } from "../widget";
import { SnackbarAlertWidget } from "./alert/snackbar_alert_widget";
import { BoundaryConditionsDialogWidget } from "./dialogs/boundary_conditions_dialog";
import { DefaultImportModalDialogWidget } from "./dialogs/default_import_modal_dialog";
import { InterpolatedSetDialogWidget } from "./dialogs/interpolated_set_dialog";
import { PythonTransformationDialogWidget } from "./dialogs/python_transformation_dialog";
import { SupercellDialogWidget } from "./dialogs/supercell_dialog";
import { SurfaceDialogWidget } from "./dialogs/surface_dialog";
import { HeaderMenuWidget } from "./header_menu_widget";
import { ItemsListWidget } from "./items_list_widget";
import { SourceEditorWidget } from "./source_editor_widget";
import { ThreeJSEditorWidget } from "./threejs_editor_widget";

export class MaterialDesignerWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.itemsList = new ItemsListWidget(SELECTORS.itemsList.wrapper);
        this.sAlertWidget = new SnackbarAlertWidget(SELECTORS.snackbarAlertWidget.wrapper);
        this.headerMenu = new HeaderMenuWidget(SELECTORS.headerMenu.wrapper);
        this.sourceEditor = new SourceEditorWidget(SELECTORS.sourceEditor.wrapper);
        this.surfaceDialog = new SurfaceDialogWidget(SELECTORS.headerMenu.surfaceDialog.wrapper);
        this.supercellDialog = new SupercellDialogWidget(
            SELECTORS.headerMenu.supercellDialog.wrapper,
        );
        this.interpolatedSetDialog = new InterpolatedSetDialogWidget(
            SELECTORS.headerMenu.interpolatedSetDialog.wrapper,
        );
        this.threeJSEditorWidget = new ThreeJSEditorWidget(SELECTORS.threeJSEditorWidget.wrapper);
        this.boundaryConditionsDialog = new BoundaryConditionsDialogWidget(
            SELECTORS.headerMenu.boundaryConditionsDialog.wrapper,
        );
        this.defaultImportModalDialog = new DefaultImportModalDialogWidget(
            SELECTORS.headerMenu.defaultImportModalDialog.wrapper,
        );
        this.pythonTransformationDialog = new PythonTransformationDialogWidget(
            SELECTORS.headerMenu.pythonTransformationDialog.wrapper,
        );
    }

    openSupercellDialog() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 1);
    }

    openSaveDialog() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Input/Output", 5);
    }

    openImportModal() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Input/Output", 1);
    }

    // eslint-disable-next-line no-unused-vars
    save(config) {}

    exit() {}

    generateSupercell(supercellMatrixAsString) {
        this.openSupercellDialog();
        this.supercellDialog.generateSupercell(supercellMatrixAsString);
        this.supercellDialog.submit();
    }

    cloneCurrentMaterial() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Edit", 4);
    }

    clickDeleteAction(index) {
        this.itemsList.deleteMaterialByIndex(index);
    }

    clickUndoRedoReset(index = 1) {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Edit", index);
    }

    openSurfaceDialog() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 4);
    }

    createSurface(config) {
        this.openSurfaceDialog();
        this.surfaceDialog.generateSurface(config);
        this.surfaceDialog.submit();
    }

    openBoundaryConditionsDialog() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 5);
    }

    addBoundaryConditions(config) {
        this.openBoundaryConditionsDialog();
        this.boundaryConditionsDialog.addBoundaryConditions(config);
        this.boundaryConditionsDialog.submit();
    }

    openInterpolateSetDialog() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 3);
    }

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
    _setMaterialParametersFromConfig(materialCSSIndex, { name, basis, lattice, supercell }) {
        this.itemsList.selectItemByIndex(materialCSSIndex);
        if (name) this.itemsList.setItemName(materialCSSIndex, name);
        if (lattice) this.sourceEditor.latticeEditor.setLattice(JSON.parse(lattice));
        if (basis) this.sourceEditor.basisEditor.setBasis(basis);
        if (supercell) this.generateSupercell(supercell);
    }

    /*
     * @summary Creates multiple materials as follows:
     *          - clone the default material multiple times
     *          - remove default material
     *          - setup parameters for each new material
     * @params configs {Array} List of configs per each material containing the information to be used on creation
     */
    createMultipleMaterials(configs) {
        // eslint-disable-next-line no-unused-vars
        configs.forEach((row) => this.cloneCurrentMaterial());
        this.itemsList.deleteMaterialByIndex(1);

        configs.forEach((config, index) => {
            const itemCSSIndex = index + 1;
            this._setMaterialParametersFromConfig(itemCSSIndex, config);
        });
    }
}
