import BoundaryConditionsDialogWidget, {
    BoundaryConditions,
} from "./BoundaryConditionsDialogWidget";
import DefaultImportModalDialogWidget from "./DefaultImportModalDialogWidget";
import HeaderMenuWidget from "./HeaderMenuWidget";
import { InterpolatedSetDialogWidget } from "./InterpolatedSetDialogWidget";
import { ItemsListWidget } from "./ItemsListWidget";
import PythonTransformationDialogWidget from "./PythonTransformationDialogWidget";
import { SourceEditorWidget } from "./SourceEditorWidget";
import { SupercellDialogWidget } from "./SupercellDialogWidget";
import SurfaceDialogWidget, { SurfaceConfig } from "./SurfaceDialogWidget";
import { ThreeJSEditorWidget } from "./ThreeJSEditorWidget";
import Widget from "./Widget";

export default class MaterialDesignerWidget extends Widget {
    headerMenu: HeaderMenuWidget;

    surfaceDialog: SurfaceDialogWidget;

    itemsList: ItemsListWidget;

    sourceEditor: SourceEditorWidget;

    threeJSEditorWidget: ThreeJSEditorWidget;

    supercellDialog: SupercellDialogWidget;

    boundaryConditionsDialog: BoundaryConditionsDialogWidget;

    interpolatedSetDialog: InterpolatedSetDialogWidget;

    defaultImportModalDialog: DefaultImportModalDialogWidget;

    pythonTransformationDialog: PythonTransformationDialogWidget;

    constructor(selector: string) {
        super(selector);
        this.itemsList = new ItemsListWidget();
        this.headerMenu = new HeaderMenuWidget();
        this.sourceEditor = new SourceEditorWidget();
        this.surfaceDialog = new SurfaceDialogWidget();
        this.threeJSEditorWidget = new ThreeJSEditorWidget();
        this.supercellDialog = new SupercellDialogWidget();
        this.boundaryConditionsDialog = new BoundaryConditionsDialogWidget();
        this.interpolatedSetDialog = new InterpolatedSetDialogWidget();
        this.defaultImportModalDialog = new DefaultImportModalDialogWidget();
        this.pythonTransformationDialog = new PythonTransformationDialogWidget();
    }

    openSurfaceDialog() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 4);
    }

    createSurface(config: SurfaceConfig) {
        this.openSurfaceDialog();
        this.surfaceDialog.generateSurface(config);
        this.surfaceDialog.submit();
    }

    cloneCurrentMaterial() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Edit", 4);
    }

    openSupercellDialog() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 1);
    }

    generateSupercell(supercellMatrixAsString: string) {
        this.openSupercellDialog();
        this.supercellDialog.generateSupercell(supercellMatrixAsString);
        this.supercellDialog.submit();
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

    createMultipleMaterials(configs) {
        // eslint-disable-next-line no-unused-vars
        configs.forEach(() => this.cloneCurrentMaterial());
        this.itemsList.deleteMaterialByIndex(1);

        configs.forEach((config, index) => {
            const itemCSSIndex = index + 1;
            this._setMaterialParametersFromConfig(itemCSSIndex, config);
        });
    }

    openBoundaryConditionsDialog() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 5);
    }

    addBoundaryConditions(config: BoundaryConditions) {
        this.openBoundaryConditionsDialog();
        this.boundaryConditionsDialog.addBoundaryConditions(config);
        this.boundaryConditionsDialog.submit();
    }

    openInterpolateSetDialog() {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Advanced", 3);
    }

    generateInterpolatedSet(nImages: number) {
        this.openInterpolateSetDialog();
        this.interpolatedSetDialog.setInterpolatedSetImagesCount(nImages);
        this.interpolatedSetDialog.submit();
    }

    clickUndoRedoReset(index = 1) {
        this.headerMenu.selectMenuItemByNameAndItemNumber("Edit", index);
    }

    clickDeleteAction(index: number) {
        this.itemsList.deleteMaterialByIndex(index);
    }
}
