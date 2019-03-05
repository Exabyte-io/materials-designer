import {safeMakeArrayIfNot} from "/imports/utils/array";

export const MATERIALS_SAVE = 'MATERIALS_SAVE';
export function saveMaterials(tags = [], useMultiple = false, isPublic = false, inSetConfig = {}, dispatch) {
    return {
        type: MATERIALS_SAVE,
        tags,
        useMultiple,
        isPublic,
        inSetConfig,
        dispatch,
    }
}

export const MATERIALS_ADD = 'MATERIALS_ADD';
export function addMaterials(newMaterials, addAtIndex) {
    return {
        type: MATERIALS_ADD,
        // autoconvert to array if passed only one material
        materials: safeMakeArrayIfNot(newMaterials),
        addAtIndex,
    }
}

export const MATERIALS_REMOVE = 'MATERIALS_REMOVE';
export function removeMaterials(indices) {
    if (indices === undefined) indices = [];  // if `indices` is undefined => removing by current index; passing empty array
    return {
        type: MATERIALS_REMOVE,
        indices: safeMakeArrayIfNot(indices),
    };
}

export const MATERIALS_EXPORT = 'MATERIALS_EXPORT';
export function exportMaterials(format, useMultiple) {
    return {
        type: MATERIALS_EXPORT,
        format,
        useMultiple,
    }
}
