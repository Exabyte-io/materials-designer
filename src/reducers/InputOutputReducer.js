import {AccountsSelector} from "/imports/accounts/selector";
import {exportToDisk} from "/imports/utils/downloader";
import {getInSetFromRoute} from "/imports/entity_sets/exports_client";

import {setIsLoading} from "../actions";
import {saveMaterialsWithConfirm} from "../../../save_with_alert";

import {
    MATERIALS_SAVE,
    MATERIALS_EXPORT,
    MATERIALS_ADD,
    MATERIALS_REMOVE,
} from "../actions";
import Material from "../../../../material";

function materialsSave(state, action) {

    // if no set information provided in action, attempt to get it from route
    const inSet = _.isEmpty(action.inSetConfig) ? getInSetFromRoute() : action.inSetConfig;

    const materialsToSave = (action.useMultiple ? state.materials : [state.materials[state.index]]).map((m, idx) => {
        m.setTags(action.tags);
        m.setPublic(action.isPublic);

        if (inSet._id) { // ignore empty inSet object
            m.inSet = (m.inSet || []).concat({
                ...inSet,
                index: idx
            });
        }
        return m;
    });

    const account = materialsToSave[0].owner || AccountsSelector.currentAccount();

    saveMaterialsWithConfirm({
        account: account,
        materials: materialsToSave,
        saveCallback: (err) => {
            if (err) {
                sAlert.error(err.reason || err.message);
            } else {
                action.dispatch(setIsLoading(false));
                sAlert.success(`Operation successful.`);
            }
        },
        noConfirmCallback: () => action.dispatch(setIsLoading(false))
    });
    // no longer consider material as updated after save
    state.materials.forEach(m => delete m.isUpdated);
    return Object.assign({}, state, {
        isLoading: true,
        materials: state.materials
    });
}

export function materialsAdd(state, action) {
    const index = state.index || 0;
    const actionMaterials = action.materials;
    const newMaterials = action.addAtIndex ?
        state.materials.slice(0, index + 1).concat(actionMaterials).concat(state.materials.slice(index + 1))
        :
        state.materials.concat(actionMaterials);
    return Object.assign({}, state, {materials: newMaterials});
}

export function materialsRemove(state, action) {
    let index = state.index;
    const materials = state.materials.slice();  // clone original array to force update to components
    // if no indices passed -> remove the material at current index
    let indices = action.indices.length ? action.indices : [index];
    // sort indices to implement logic for index decrement in splice below
    indices = indices.sort();

    // sanity check
    if (materials.length === 1) {
        sAlert.warning("Prevented remove action: only one material in set.");
        return state;
    }
    // remove elements at indices (array is modified in place => subtract idx within `each`)
    indices.forEach((indicesArrayElement, idx) => {
        const currentMaterial = materials[indicesArrayElement - idx];
        const formula = currentMaterial.formula;
        sAlert.success(`Removed material with index ${indicesArrayElement} and formula ${formula} from set.`);
        materials.splice(indicesArrayElement - idx, 1);
        // lower the current index if it is above the deleted material's index
        if (index > 0) index = index - 1;
    });
    return Object.assign({}, state, {
        materials: materials,
        index: index
    });
}

export function materialsExport(state, action) {
    const exportHandlers = {
        "json": (m) => JSON.stringify(m.toJSON()),
        "poscar": (m) => m.getAsPOSCAR(),
    };
    const format = Object.keys(exportHandlers).includes(action.format) ? action.format : 'json';

    const materials = action.useMultiple ? state.materials : [state.materials[state.index]];
    // TODO: download as a zip bundle when `action.useMultiple === true`
    materials.map(m => exportToDisk(exportHandlers[format](m), m.name, format));
    return state;

}

export default {
    [MATERIALS_ADD]: materialsAdd,
    [MATERIALS_REMOVE]: materialsRemove,
    [MATERIALS_SAVE]: materialsSave,
    [MATERIALS_EXPORT]: materialsExport,
};

