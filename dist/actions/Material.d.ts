export function updateOneMaterial(newMaterial: any, index: any): {
    type: string;
    material: any;
    index: any;
};
export function cloneOneMaterial(): {
    type: string;
};
export function materialsToggleIsNonPeriodicForOne(): {
    type: string;
};
export function updateNameForOneMaterial(newName: any, index: any): {
    type: string;
    name: any;
    index: any;
};
export function generateSupercellForOneMaterial(matrix: any): {
    type: string;
    matrix: any;
};
export function generateSurfaceForOneMaterial(config: any): any;
export function updateMaterialsIndex(newIndex: any): {
    type: string;
    index: any;
};
export function setBoundaryConditionsForOneMaterial(config: any): any;
export const MATERIALS_UPDATE_ONE: "MATERIALS_UPDATE_ONE";
export const MATERIALS_CLONE_ONE: "MATERIALS_CLONE_ONE";
export const MATERIALS_TOGGLE_IS_NON_PERIODIC_FOR_ONE: "MATERIALS_TOGGLE_IS_NON_PERIODIC_FOR_ONE";
export const MATERIALS_UPDATE_NAME_FOR_ONE: "MATERIALS_UPDATE_NAME_FOR_ONE";
export const MATERIALS_GENERATE_SUPERCELL_FOR_ONE: "MATERIALS_GENERATE_SUPERCELL_FOR_ONE";
export const MATERIALS_GENERATE_SURFACE_FOR_ONE: "MATERIALS_GENERATE_SURFACE_FOR_ONE";
export const MATERIALS_UPDATE_INDEX: "MATERIALS_UPDATE_INDEX";
export const MATERIALS_SET_BOUNDARY_CONDITIONS_FOR_ONE: "MATERIALS_SET_BOUNDARY_CONDITIONS_FOR_ONE";
