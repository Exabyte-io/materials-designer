"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SELECTORS = void 0;
const SELECTORS = exports.SELECTORS = {
  wrapper: "#materials-designer",
  actionDialogSubmitButton: 'button[data-name="Submit"]',
  headerMenu: {
    wrapper: ".materials-designer-header-menu",
    checkIndicatorButton: "button .zmdi-check",
    spinnerIndicatorButton: "button .zmdi-spinner",
    menuDialogByName: name => "[data-name=\"".concat(name, "\"]"),
    menuDialogItemByNumber: (name, number) => ".button-activated-menu[data-name=\"".concat(name, "-menu\"] li[role=\"menuitem\"]:nth-of-type(").concat(number, ")"),
    supercellDialog: {
      wrapper: "#supercellModal",
      submitButton: "#supercellModal-submit-button",
      matrixElementByIndices: (i, j) => "div.m".concat(i + 1).concat(j + 1, " input")
    },
    interpolatedSetDialog: {
      wrapper: "#interpolatedSetModal",
      submitButton: "#interpolatedSetModal-submit-button",
      intermediateImagesInput: "input[type='number']"
    },
    surfaceDialog: {
      wrapper: "#surfaceModal",
      submitButton: "#surfaceModal-submit-button",
      h: '[data-tid="miller-h"] input',
      k: '[data-tid="miller-k"] input',
      l: '[data-tid="miller-l"] input',
      thickness: '[data-tid="thickness"] input',
      vacuumRatio: '[data-tid="vacuum-ratio"] input',
      vx: '[data-tid="vx"] input',
      vy: '[data-tid="vy"] input'
    },
    boundaryConditionsDialog: {
      wrapper: "#BoundaryConditionsModal",
      submitButton: "#BoundaryConditionsModal-submit-button",
      type: '[data-tid="type"]',
      offset: '[data-tid="offset"] input'
    },
    defaultImportModalDialog: {
      wrapper: "#defaultImportModalDialog",
      dialog: 'div[role="dialog"]',
      uploadInput: 'input[data-name="fileapi"]',
      addButton: '[data-name="upload-button"]',
      gridFileName: fileName => "div[role=\"cell\"][data-field=\"fileName\"] div[title=\"".concat(fileName, "\"]"),
      gridFormat: format => "div[role=\"cell\"][data-field=\"format\"] div[title=\"".concat(format, "\"]"),
      removeButton: fileName => "button#".concat(fileName, "-remove-button"),
      submitButton: "#defaultImportModalDialog-submit-button",
      cancelButton: "#defaultImportModalDialog-cancel-button"
    },
    pythonTransformationDialog: {
      wrapper: "#python-transformation-dialog",
      dialog: 'div[role="dialog"]',
      materialsSelector: "[data-tid='materials-selector']",
      materialsSelectorItem: index => "[data-tid='select-material']:nth-of-type(".concat(index, ")"),
      transformationSelector: "[data-tid='transformation-selector']",
      transformationSelectorItem: title => "//li[contains(text(), '".concat(title, "')]"),
      codeInput: function () {
        let id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        return "python-code-input-".concat(id);
      },
      pythonOutput: function () {
        let id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        return "python-output-".concat(id);
      },
      clearOutputButton: function () {
        let id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        return "#clear-output-".concat(id);
      },
      runButton: ".run-button",
      submitButton: "#python-transformation-dialog-submit-button",
      cancelButton: "#python-transformation-dialog-cancel-button"
    }
  },
  itemsList: {
    wrapper: ".materials-designer-items-list",
    nameInput: "input",
    itemByIndex: index => "ul>div:nth-of-type(".concat(index, ") li"),
    iconButtonDelete: ".icon-button-delete"
  },
  sourceEditor: {
    wrapper: "",
    basisEditor: {
      wrapper: "",
      basisTextArea: "basis-xyz",
      basisUnitsByName: name => "#basis-units-' + ".concat(name)
    },
    latticeEditor: {
      wrapper: ".crystal-lattice",
      latticeFormTrigger: '[role="button"]',
      latticeFormBody: ".crystal-lattice-config",
      latticeOptionSelectorByNameInput: name => "input[name=\"".concat(name, "\"]"),
      latticeOptionSelectorByNameSelect: name => "[data-tid=\"".concat(name, "\"]"),
      latticeFormSaveButton: "button.save-lattice-config"
    }
  },
  snackbarAlertWidget: {
    wrapper: ".alert",
    alertByType: type => ".alert-".concat(type),
    closeButton: "button[title='Close']"
  },
  threeJSEditorWidget: {
    wrapper: "#threejs-editor",
    viewport: "#threejs-editor #viewport",
    menuByTitle: title => "//div[@class=\"menu\"] //div[starts-with(text(),\"".concat(title, "\")]"),
    menuItemByTitle: title => "//div[@class=\"menu\"] //div[@class=\"options\"] //div[starts-with(text(),\"".concat(title, "\")]"),
    sceneObjectByName: name => "//div[@class=\"Outliner\"] //div[@class=\"option\" and starts-with(text(),\" ".concat(name, "\")]"),
    sceneObjectOpenerByName: name => "//div[@id=\"outliner\"] //div[contains(@class,\"option\") and text() = \" ".concat(name, "\"] //span[contains(@class,\"opener\")]"),
    sidebarTabByTitle: title => "//div[@id=\"sidebar\"] //div[@id=\"tabs\"] //span[starts-with(text(),\"".concat(title, "\")]"),
    sceneObjectTabByTitle: title => "//div[@id=\"sidebar\"] //span //div[@id=\"tabs\"] //span[starts-with(text(),\"".concat(title, "\")]"),
    sceneObjectPositionByIndex: index => "//div[@id=\"sidebar\"] //div[@class=\"Panel\"] //div[@class=\"Row\"] //span[starts-with(text(), \"Position\")]/following-sibling::input[".concat(index, "]"),
    toolbarBtnByTitle: title => "//div[@id=\"toolbar\"] //button //img[contains(@title,\"".concat(title, "\")]")
  },
  modalBackdrop: ".modal-backdrop.fade"
};