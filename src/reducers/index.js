import undoable from "redux-undo";

import { MATERIALS_UPDATE_INDEX, MATERIALS_UPDATE_ONE } from "../actions";
import { createReducer } from "../utils/react/reducer";
import IsLoadingReducer from "../utils/redux/is_loading/reducer";
import StateResetReducer from "../utils/redux/reset_state/reducer";
import InputOutputReducer from "./InputOutput";
import MaterialReducer from "./Material";

export function createMaterialsDesignerReducer(initialState, externalReducer) {
    return undoable(
        createReducer(
            initialState,
            StateResetReducer,
            IsLoadingReducer,
            InputOutputReducer,
            MaterialReducer,
            externalReducer || {},
        ),
        {
            limit: 10,
            filter: (action, currentState, previousHistory) => {
                if (action.type === MATERIALS_UPDATE_INDEX) {
                    return false;
                }

                // keeps "future" history after "undo" action
                if (action.type === MATERIALS_UPDATE_ONE && previousHistory.future.length) {
                    return false;
                }

                return true;
            },
        },
    );
}
