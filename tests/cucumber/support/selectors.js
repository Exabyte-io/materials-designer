export const SELECTORS = {
    wrapper: ".materials-designer",
    actionDialogSubmitButton: 'button[data-name="Submit"]',
    headerMenu: {
        wrapper: ".materials-designer-header-menu",
        checkIndicatorButton: "button .zmdi-check",
        spinnerIndicatorButton: "button .zmdi-spinner",
        menuDialogByName: (name) => `[data-name="${name}"]`,
        menuDialogItemByNumber: (name, number) =>
            `.button-activated-menu[data-name="${name}-menu"] li[role="menuitem"]:nth-of-type(${number})`,
        supercellDialog: {
            wrapper: "#supercellModal",
            submitButton: "#make-supercell",
            matrixElementByIndices: (i, j) => `div.m${i + 1}${j + 1} input`,
        },
        interpolatedSetDialog: {
            wrapper: "#interpolatedSetModal",
            submitButton: "#generate-interpolated-set",
            intermediateImagesInput: "input[type='number']",
        },
        surfaceDialog: {
            wrapper: "#surfaceModal",
            submitButton: "#make-surface",
            h: '[data-tid="miller-h"] input',
            k: '[data-tid="miller-k"] input',
            l: '[data-tid="miller-l"] input',
            thickness: '[data-tid="thickness"] input',
            vacuumRatio: '[data-tid="vacuum-ratio"] input',
            vx: '[data-tid="vx"] input',
            vy: '[data-tid="vy"] input',
        },
        boundaryConditionsDialog: {
            wrapper: "#BoundaryConditionsModal",
            submitButton: "#boundary-conditions-submit",
            type: '[data-tid="type"] select',
            offset: '[data-tid="offset"] input',
        },
        defaultImportModalDialog: {
            wrapper: "#defaultImportModalDialog",
            dialog: 'div[role="dialog"]',
            uploadInput: 'input[data-name="fileapi"]',
            addButton: '[data-name="add-button"]',
            gridFileName: (fileName) =>
                `div[role="cell"][data-field="fileName"] div[title="${fileName}"]`,
            gridFormat: (format) => `div[role="cell"][data-field="format"] div[title="${format}"]`,
            removeButton: (fileName) => `button#${fileName}-remove-button`,
            submitButton: 'button[data-name="Submit"]',
            cancelButton: 'button[data-name="Cancel"]',
        },
    },
    itemsList: {
        wrapper: ".materials-designer-items-list",
        nameInput: "input",
        itemByIndex: (index) => `nav div[role="button"]:nth-of-type(${index})`,
        iconButtonDelete: ".icon-button-delete",
    },
    sourceEditor: {
        wrapper: "",
        basisEditor: {
            wrapper: "",
            basisTextArea: "basis-xyz",
            basisUnitsByName: (name) => `#basis-units-' + ${name}`,
        },
        latticeEditor: {
            wrapper: ".crystal-lattice",
            latticeFormTrigger: '[role="button"]',
            latticeFormBody: ".crystal-lattice-config",
            latticeOptionSelectorByNameInput: (name) => `input[name="${name}"]`,
            latticeOptionSelectorByNameSelect: (name) => `select[name="${name}"]`,
            latticeFormSaveButton: "button.save-lattice-config",
        },
    },
    sAlertWidget: {
        wrapper: ".alert.s-alert-box",
        alertByType: (type) => `.alert-${type}`,
        closeButton: "button.close",
    },
    threeJSEditorWidget: {
        wrapper: "#threejs-editor",
        viewport: "#threejs-editor #viewport",
        menuByTitle: (title) => `//div[@class="menu"] //div[starts-with(text(),"${title}")]`,
        menuItemByTitle: (title) =>
            `//div[@class="menu"] //div[@class="options"] //div[starts-with(text(),"${title}")]`,
        sceneObjectByName: (name) =>
            `//div[@class="Outliner"] //div[@class="option" and starts-with(text()," ${name}")]`,
        sceneObjectOpenerByName: (name) =>
            `//div[@id="outliner"] //div[contains(@class,"option") and text() = " ${name}"] //span[contains(@class,"opener")]`,
        sidebarTabByTitle: (title) =>
            `//div[@id="sidebar"] //div[@id="tabs"] //span[starts-with(text(),"${title}")]`,
        sceneObjectTabByTitle: (title) =>
            `//div[@id="sidebar"] //span //div[@id="tabs"] //span[starts-with(text(),"${title}")]`,
        sceneObjectPositionByIndex: (index) =>
            `//div[@id="sidebar"] //div[@class="Panel"] //div[@class="Row"] //span[starts-with(text(), "Position")]/following-sibling::input[${index}]`,
        toolbarBtnByTitle: (title) =>
            `//div[@id="toolbar"] //button //img[contains(@title,"${title}")]`,
    },
    modalBackdrop: ".modal-backdrop.fade",
};
