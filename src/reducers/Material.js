import NPMsAlert from 'react-s-alert';
import {Made} from "@exabyte-io/made.js";

import {Material} from "../material";
import {displayMessage} from "../i18n/messages";

import {
    MATERIALS_CLONE_ONE,
    MATERIALS_UPDATE_ONE,
    MATERIALS_UPDATE_INDEX,
    MATERIALS_UPDATE_NAME_FOR_ONE,
    MATERIALS_GENERATE_SURFACE_FOR_ONE,
    MATERIALS_GENERATE_SUPERCELL_FOR_ONE,
    MATERIALS_SET_BOUNDARY_CONDITIONS_FOR_ONE,
    MATERIALS_SET_IS_NON_PERIODIC_FOR_ONE,
} from "../actions";

function materialsUpdateOne(state, action) {
    const materials = state.materials.slice();  // get copy of array
    const index = action.index || state.index;  // not passing index when modifying currently displayed material
    const material = action.material.clone();   // clone material to assert props re-render
    material.isUpdated = true;                  // to be used inside components
    material.isNonPeriodic = action.material.isNonPeriodic;
    // TODO: consider adjusting the logic to avoid expensive cloning procedure below
    materials[index] = material;
    return Object.assign({}, state, {materials: materials});
}

function materialsCloneOne(state, action) {
    const materials = state.materials.slice(); // get copy of array
    const material = materials[state.index].clone();
    material.cleanOnCopy();
    material.name = "New Material";
    material.isUpdated = true;
    materials.push(material);
    return Object.assign({}, state, {materials});
}

function materialsUpdateNameForOne(state, action) {
    const materials = state.materials.slice();  // get copy of array
    // not passing index when modifying currently displayed material
    const index = (!action.index && action.index !== 0) ? action.index : state.index;
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
    const supercell = new Material(supercellConfig);
    return materialsUpdateOne(state, Object.assign(action, {material: supercell}));
}

function _setMetadataForSlabConfig(slabConfig, {h, k, l, thickness, vacuumRatio, vx, vy, material}) {
    const bulkId = material && (material.id || material._id);
    if (!(bulkId)) NPMsAlert.warning(displayMessage('surface.noBulkId'), {timeout: 10000});

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
            bulkId
        }
    });
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

    const newMaterial = new Material(supercellConfig);
    Made.tools.material.scaleOneLatticeVector(newMaterial, ["a", "b", "c"][outOfPlaneAxisIndex], 1 / (1 - vacuumRatio));

    return materialsUpdateOne(state, Object.assign(action, {material: newMaterial}));
}

function materialsSetBoundaryConditionsForOne(state, action) {
    const newMaterial = state.materials[state.index].clone();
    newMaterial.metadata = Object.assign({}, newMaterial.metadata, {
        boundaryConditions: {
            type: action.boundaryType,
            offset: action.boundaryOffset,
        }
    });
    return materialsUpdateOne(state, Object.assign(action, {material: newMaterial}));
}

export function materialsSetIsNonPeriodicForOne(state) {
    const newMaterial = state.materials[state.index].clone();
    state.materials[state.index].isNonPeriodic = !newMaterial.isNonPeriodic;
    return materialsUpdateOne(state, Object.assign(newMaterial, {material: state.materials[state.index]}));
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
    [MATERIALS_SET_BOUNDARY_CONDITIONS_FOR_ONE]: materialsSetBoundaryConditionsForOne,
    [MATERIALS_SET_IS_NON_PERIODIC_FOR_ONE]: materialsSetIsNonPeriodicForOne,
};
