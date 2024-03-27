export function saveMaterials(config: any, dispatch: any): {
    type: string;
    config: any;
    dispatch: any;
};
export function addMaterials(newMaterials: any, addAtIndex: any): {
    type: string;
    materials: any[];
    addAtIndex: any;
};
export function removeMaterials(indices: any): {
    type: string;
    indices: any[];
};
export function exportMaterials(format: any, useMultiple: any): {
    type: string;
    format: any;
    useMultiple: any;
};
export const MATERIALS_SAVE: "MATERIALS_SAVE";
export const MATERIALS_ADD: "MATERIALS_ADD";
export const MATERIALS_REMOVE: "MATERIALS_REMOVE";
export const MATERIALS_EXPORT: "MATERIALS_EXPORT";
