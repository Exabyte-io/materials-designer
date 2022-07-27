import _isEqual from "lodash/isEqual";
import { ActionCreators } from "redux-undo";

/*
 We can't use plain redux-undo actions because some material modifications (eg. supercell creation)
 require dispatching multiple actions sequentially.

 So we need to manually go through actions history and find the "starting point" of the action we want to undo/redo.
 "Starting point" is the action that has not the same materials as in present state.
*/

function getMaterialHash(material) {
    const hash = material.calculateHash();
    return hash;
}

export function undo() {
    return (dispatch, getState) => {
        const state = getState();
        const pastStates = state.past;

        // calculate hashes of materials for current state
        const presentMaterialsHashes = state.present.materials.map(getMaterialHash);

        let startingPointIndex;

        // going from the "newest" previous state to the "oldest" and compare its hashes with the present state
        for (let i = pastStates.length - 1; i >= 0; i--) {
            const pastState = pastStates[i];
            const pastMaterialsHashes = pastState.materials.map(getMaterialHash);

            // if hashes are not equal, we found the starting point
            if (!_isEqual(presentMaterialsHashes, pastMaterialsHashes)) {
                startingPointIndex = i;
                break;
            }
        }

        // if starting point was found, we can undo
        if (startingPointIndex !== undefined) {
            dispatch(ActionCreators.jumpToPast(startingPointIndex));
        }
    };
}

export function redo() {
    return (dispatch, getState) => {
        const state = getState();
        const futureStates = state.future;

        // calculate hashes of materials for current state
        const presentMaterialsHashes = state.present.materials.map(getMaterialHash);

        let startingPointIndex;

        // going from the "oldest" future state to the "newest" and compare its hashes with the present state
        for (let i = 0; i < futureStates.length; i++) {
            const futureState = futureStates[i];
            const futureMaterialsHashes = futureState.materials.map(getMaterialHash);

            // if hashes are not equal, we found the starting point
            if (!_isEqual(presentMaterialsHashes, futureMaterialsHashes)) {
                startingPointIndex = i;
                break;
            }
        }

        // if starting point was found, we can redo
        if (startingPointIndex !== undefined) {
            dispatch(ActionCreators.jumpToFuture(startingPointIndex));
        }
    };
}
