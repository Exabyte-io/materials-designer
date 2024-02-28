import { enqueueSnackbar } from "notistack";

import { MATERIALS_ADD, MATERIALS_EXPORT, MATERIALS_REMOVE, MATERIALS_SAVE } from "../actions";
import { exportToDisk } from "../utils/downloader";

// eslint-disable-next-line no-unused-vars
export function materialsSave(state, action) {
    return { ...state };
}

export function materialsAdd(state, action) {
    const index = state.index || 0;
    const actionMaterials = action.materials;
    const newMaterials = action.addAtIndex
        ? state.materials
              .slice(0, index + 1)
              .concat(actionMaterials)
              .concat(state.materials.slice(index + 1))
        : state.materials.concat(actionMaterials);
    return { ...state, materials: newMaterials };
}

export function materialsRemove(state, action) {
    let { index } = state;
    const materials = state.materials.slice(); // clone original array to force update to components
    // if no indices passed -> remove the material at current index
    let indices = action.indices.length ? action.indices : [index];
    // sort indices to implement logic for index decrement in splice below
    indices = indices.sort();

    // sanity check
    if (materials.length === 1) {
        enqueueSnackbar("Prevented remove action: only one material in set.", {
            variant: "warning",
        });
        return state;
    }
    // remove elements at indices (array is modified in place => subtract idx within `each`)
    indices.forEach((indicesArrayElement, idx) => {
        const currentMaterial = materials[indicesArrayElement - idx];
        const { formula } = currentMaterial;
        enqueueSnackbar(
            `Removed material with index ${indicesArrayElement} and formula ${formula} from set.`,
            { variant: "success" },
        );
        materials.splice(indicesArrayElement - idx, 1);
        // lower the current index if it is above the deleted material's index
        if (index > 0) index -= 1;
    });
    return { ...state, materials, index };
}

export function materialsExport(state, action) {
    const exportHandlers = {
        json: (m) => JSON.stringify(m.toJSON()),
        poscar: (m) => m.getAsPOSCAR(),
    };
    const format = Object.keys(exportHandlers).includes(action.format) ? action.format : "json";

    const materials = action.useMultiple ? state.materials : [state.materials[state.index]];
    // TODO: download as a zip bundle when `action.useMultiple === true`
    materials.map((m) => exportToDisk(exportHandlers[format](m), m.name, format));
    return state;
}

export default {
    [MATERIALS_ADD]: materialsAdd,
    [MATERIALS_SAVE]: materialsSave,
    [MATERIALS_REMOVE]: materialsRemove,
    [MATERIALS_EXPORT]: materialsExport,
};
