import {Made} from "made.js";
import Alert from 'react-s-alert';
import {displayMessage} from "../utils/messages";

import {
    MATERIALS_UPDATE_INDEX,
    MATERIALS_UPDATE_ONE,
    MATERIALS_CLONE_ONE,
    MATERIALS_UPDATE_NAME_FOR_ONE,
    MATERIALS_GENERATE_SUPERCELL_FOR_ONE,
    MATERIALS_GENERATE_SURFACE_FOR_ONE,
} from "../actions";

function materialsUpdateOne(state, action) {
    const materials = state.materials.slice();  // get copy of array
    const index = action.index || state.index;  // not passing index when modifying currently displayed material
    const material = action.material.clone();   // clone material to assert props re-render
    material.isUpdated = true;                  // to be used inside components
    // TODO: consider adjusting the logic to avoid expensive cloning procedure below
    materials[index] = material;
    return Object.assign({}, state, {materials: materials});
}

function materialsCloneOne(state, action) {
    const materials = state.materials.slice(); // get copy of array
    const material = materials[state.index].clone();
    material.cleanOnCopy();
    material.name = "New Material";
    materials.push(material);
    return Object.assign({}, state, {materials});
}

function materialsUpdateNameForOne(state, action) {
    const materials = state.materials.slice();  // get copy of array
    const index = (!action.index && action.index !== 0) ? action.index : state.index;  // not passing index when modifying currently displayed material
    const material = state.materials[index];
    // TODO: figure out why material is undefined
    if (material) {
        material.name = action.name;
        material.isUpdated = true;
        materials[index] = material;  // intentionally avoid cloning material to prevent re-render for 3d editor
    }
    return Object.assign({}, state, {materials: materials});
}

function materialsGenerateSupercellForOne(state, action) {
    const matrixAsNestedArray = action.matrix;
    const material = state.materials[state.index];  // only using currently active material
    const supercellConfig = Made.tools.supercell.generateConfig(material, matrixAsNestedArray);
    const supercell = new Made.Material(supercellConfig);
    return materialsUpdateOne(state, Object.assign(action, {material: supercell}));
}

function _setMetadataForSlabConfig(slabConfig, {h, k, l, thickness, vacuumRatio, vx, vy, material}) {
    const bulkId = material && (material.id || material._id);
    const bulkExabyteId = material && (material.exabyteId);

    if (!(bulkId || bulkExabyteId)) {
        Alert.warning(displayMessage('materialsDesigner.createSurface.noBulkId'), {timeout: 10000});
    }

    Object.assign(slabConfig, {
        metadata: {
            isSlab: true,
            h,
            k,
            l,
            thickness,
            vacuumRatio,
            vx,
            vy,
            bulkId,
            bulkExabyteId,
        }
    });
    slabConfig.tags = [].concat(slabConfig.tags, "slab").filter(x => x);
}

function materialsGenerateSurfaceForOne(state, action) {
    const material = state.materials[state.index];  // only using currently active material

    const {h, k, l, thickness, vacuumRatio, vx, vy} = action;
    const supercellConfig = Made.tools.surface.generateConfig(material, [h, k, l], thickness, vx, vy);
    const outOfPlaneAxisIndex = supercellConfig.outOfPlaneAxisIndex;

    _setMetadataForSlabConfig(supercellConfig, {
        ...action,
        material
    });

    const newMaterial = new Made.Material(supercellConfig);
    Made.tools.material.scaleOneLatticeVector(newMaterial, ["a", "b", "c"][outOfPlaneAxisIndex], 1 / (1 - vacuumRatio));

    return materialsUpdateOne(state, Object.assign(action, {material: newMaterial}));
}

export function materialsUpdateIndex(state, action) {
    return Object.assign({}, state, {index: action.index});
}

export default {
    [MATERIALS_UPDATE_INDEX]: materialsUpdateIndex,
    [MATERIALS_UPDATE_ONE]: materialsUpdateOne,
    [MATERIALS_CLONE_ONE]: materialsCloneOne,
    [MATERIALS_UPDATE_NAME_FOR_ONE]: materialsUpdateNameForOne,
    [MATERIALS_GENERATE_SUPERCELL_FOR_ONE]: materialsGenerateSupercellForOne,
    [MATERIALS_GENERATE_SURFACE_FOR_ONE]: materialsGenerateSurfaceForOne,
};
