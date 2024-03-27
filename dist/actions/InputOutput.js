import { safeMakeArrayIfNot } from "../utils/array";
export const MATERIALS_SAVE = "MATERIALS_SAVE";
export function saveMaterials(config, dispatch) {
    return {
        type: MATERIALS_SAVE,
        config,
        dispatch,
    };
}
export const MATERIALS_ADD = "MATERIALS_ADD";
export function addMaterials(newMaterials, addAtIndex) {
    return {
        type: MATERIALS_ADD,
        // autoconvert to array if passed only one material
        materials: safeMakeArrayIfNot(newMaterials),
        addAtIndex,
    };
}
export const MATERIALS_REMOVE = "MATERIALS_REMOVE";
export function removeMaterials(indices) {
    // if `indices` is undefined => removing by current index; passing empty array
    const passedIndices = indices !== null && indices !== void 0 ? indices : [];
    return {
        type: MATERIALS_REMOVE,
        indices: safeMakeArrayIfNot(passedIndices),
    };
}
export const MATERIALS_EXPORT = "MATERIALS_EXPORT";
export function exportMaterials(format, useMultiple) {
    return {
        type: MATERIALS_EXPORT,
        format,
        useMultiple,
    };
}
