"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MaterialDesignerWidget = void 0;
var _selectors = require("../selectors");
var _widget = require("../widget");
var _snackbar_alert_widget = require("./alert/snackbar_alert_widget");
var _boundary_conditions_dialog = require("./dialogs/boundary_conditions_dialog");
var _default_import_modal_dialog = require("./dialogs/default_import_modal_dialog");
var _interpolated_set_dialog = require("./dialogs/interpolated_set_dialog");
var _python_transformation_dialog = require("./dialogs/python_transformation_dialog");
var _supercell_dialog = require("./dialogs/supercell_dialog");
var _surface_dialog = require("./dialogs/surface_dialog");
var _header_menu_widget = require("./header_menu_widget");
var _items_list_widget = require("./items_list_widget");
var _source_editor_widget = require("./source_editor_widget");
var _threejs_editor_widget = require("./threejs_editor_widget");
/* eslint-disable class-methods-use-this */

class MaterialDesignerWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this.itemsList = new _items_list_widget.ItemsListWidget(_selectors.SELECTORS.itemsList.wrapper);
    this.sAlertWidget = new _snackbar_alert_widget.SnackbarAlertWidget(_selectors.SELECTORS.snackbarAlertWidget.wrapper);
    this.headerMenu = new _header_menu_widget.HeaderMenuWidget(_selectors.SELECTORS.headerMenu.wrapper);
    this.sourceEditor = new _source_editor_widget.SourceEditorWidget(_selectors.SELECTORS.sourceEditor.wrapper);
    this.surfaceDialog = new _surface_dialog.SurfaceDialogWidget(_selectors.SELECTORS.headerMenu.surfaceDialog.wrapper);
    this.supercellDialog = new _supercell_dialog.SupercellDialogWidget(_selectors.SELECTORS.headerMenu.supercellDialog.wrapper);
    this.interpolatedSetDialog = new _interpolated_set_dialog.InterpolatedSetDialogWidget(_selectors.SELECTORS.headerMenu.interpolatedSetDialog.wrapper);
    this.threeJSEditorWidget = new _threejs_editor_widget.ThreeJSEditorWidget(_selectors.SELECTORS.threeJSEditorWidget.wrapper);
    this.boundaryConditionsDialog = new _boundary_conditions_dialog.BoundaryConditionsDialogWidget(_selectors.SELECTORS.headerMenu.boundaryConditionsDialog.wrapper);
    this.defaultImportModalDialog = new _default_import_modal_dialog.DefaultImportModalDialogWidget(_selectors.SELECTORS.headerMenu.defaultImportModalDialog.wrapper);
    this.pythonTransformationDialog = new _python_transformation_dialog.PythonTransformationDialogWidget(_selectors.SELECTORS.headerMenu.pythonTransformationDialog.wrapper);
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
  clickUndoRedoReset() {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
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
  _setMaterialParametersFromConfig(materialCSSIndex, _ref) {
    let {
      name,
      basis,
      lattice,
      supercell
    } = _ref;
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
    configs.forEach(row => this.cloneCurrentMaterial());
    this.itemsList.deleteMaterialByIndex(1);
    configs.forEach((config, index) => {
      const itemCSSIndex = index + 1;
      this._setMaterialParametersFromConfig(itemCSSIndex, config);
    });
  }
}
exports.MaterialDesignerWidget = MaterialDesignerWidget;