export const SELECTORS = {
    wrapper: ".materials-designer",
    actionDialogSubmitButton: `button[data-name="Submit"]`,
    headerMenu: {
        wrapper: ".materials-designer-header-menu",
        checkIndicatorButton: "button .zmdi-check",
        spinnerIndicatorButton: "button .zmdi-spinner",
        menuDialogByName: (name) => `[data-name="${name}"]`,
        menuDialogItemByNumber: (name, number) =>
            `.button-activated-menu[data-name="${name}-menu"] li[role="menuitem"]:nth-of-type(${number})`,
        saveDialog: {
            wrapper: "",
            tagsSelectorInput: '[data-name="chips-array"] input',
            isPublicTriggerCheckbox: '[data-name="is-public"]',
            isPublicTriggerCheckboxInput: '[data-name="is-public"] input',
            saveAllTriggerCheckbox: '[data-name="use-multiple"]',
            selectMaterialsSetTextInput: '[placeholder="None selected"]',
            materialsSetSelectExplorerWrapper: "#materials-set-select",
        },
        supercellDialog: {
            wrapper: "#supercellModal",
            submitButton: "#make-supercell",
            matrixElementByIndices: (i, j) => `input.m${i + 1}${j + 1}`,
        },
        interpolatedSetDialog: {
            wrapper: "#interpolatedSetModal",
            submitButton: "#generate-interpolated-set",
            intermediateImagesInput: "input[type='number']"
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
        }
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
            basisTextArea: 'textarea[name="basis-xyz"]',
            basisUnitsByName: (name) => `#basis-units-' + ${name}`
        },
        latticeEditor: {
            wrapper: '.crystal-lattice',
            latticeFormTrigger: '[role="button"]',
            latticeFormBody: '.crystal-lattice-config',
            latticeOptionSelectorByNameInput: (name) => `input[name="${name}"]`,
            latticeOptionSelectorByNameSelect: (name) => `select[name="${name}"]`,
            latticeFormSaveButton: `button.save-lattice-config`,
        }
    },
    sAlertWidget: {
        wrapper: ".alert.s-alert-box",
        alertByType: (type) => `.alert-${type}`,
        closeButton: 'button.close',
    },
};
