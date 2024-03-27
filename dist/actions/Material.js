export const MATERIALS_UPDATE_ONE = "MATERIALS_UPDATE_ONE";
export function updateOneMaterial(newMaterial, index) {
    return {
        type: MATERIALS_UPDATE_ONE,
        material: newMaterial,
        index,
    };
}
export const MATERIALS_CLONE_ONE = "MATERIALS_CLONE_ONE";
export function cloneOneMaterial() {
    return {
        type: MATERIALS_CLONE_ONE,
    };
}
export const MATERIALS_TOGGLE_IS_NON_PERIODIC_FOR_ONE = "MATERIALS_TOGGLE_IS_NON_PERIODIC_FOR_ONE";
export function materialsToggleIsNonPeriodicForOne() {
    return {
        type: MATERIALS_TOGGLE_IS_NON_PERIODIC_FOR_ONE,
    };
}
export const MATERIALS_UPDATE_NAME_FOR_ONE = "MATERIALS_UPDATE_NAME_FOR_ONE";
export function updateNameForOneMaterial(newName, index) {
    return {
        type: MATERIALS_UPDATE_NAME_FOR_ONE,
        name: newName,
        index,
    };
}
export const MATERIALS_GENERATE_SUPERCELL_FOR_ONE = "MATERIALS_GENERATE_SUPERCELL_FOR_ONE";
export function generateSupercellForOneMaterial(matrix) {
    return {
        type: MATERIALS_GENERATE_SUPERCELL_FOR_ONE,
        matrix,
    };
}
export const MATERIALS_GENERATE_SURFACE_FOR_ONE = "MATERIALS_GENERATE_SURFACE_FOR_ONE";
export function generateSurfaceForOneMaterial(config) {
    return {
        type: MATERIALS_GENERATE_SURFACE_FOR_ONE,
        ...config,
    };
}
export const MATERIALS_UPDATE_INDEX = "MATERIALS_UPDATE_INDEX";
export function updateMaterialsIndex(newIndex) {
    return {
        type: MATERIALS_UPDATE_INDEX,
        index: newIndex,
    };
}
export const MATERIALS_SET_BOUNDARY_CONDITIONS_FOR_ONE = "MATERIALS_SET_BOUNDARY_CONDITIONS_FOR_ONE";
export function setBoundaryConditionsForOneMaterial(config) {
    return {
        type: MATERIALS_SET_BOUNDARY_CONDITIONS_FOR_ONE,
        ...config,
    };
}
