import {createReducer} from "../utils/react/reducer";
import undoable, {excludeAction} from 'redux-undo';

import StateResetReducer from "../utils/redux/reset_state/reducer"
import IsLoadingReducer from "../utils/redux/is_loading/reducer"

import {MATERIALS_UPDATE_INDEX} from "../actions";
import MaterialReducer from "./MaterialReducer";
import InputOutputReducer from "./InputOutputReducer";

export const createMaterialsDesignerReducer = function (initialState, externalReducer) {
    return undoable(
        createReducer(
            initialState,
            StateResetReducer,
            IsLoadingReducer,
            InputOutputReducer,
            MaterialReducer,
        ),
        {
            limit: 10,
            filter: excludeAction(MATERIALS_UPDATE_INDEX)
        },
    )
};
