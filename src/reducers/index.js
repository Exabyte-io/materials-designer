import undoable, {excludeAction} from 'redux-undo';

import {createReducer} from "../utils/react/reducer";
import IsLoadingReducer from "../utils/redux/is_loading/reducer"
import StateResetReducer from "../utils/redux/reset_state/reducer"

import MaterialReducer from "./MaterialReducer";
import {MATERIALS_UPDATE_INDEX} from "../actions";
import InputOutputReducer from "./InputOutputReducer";

export const createMaterialsDesignerReducer = function (initialState, externalReducer) {
    return undoable(
        createReducer(
            initialState,
            StateResetReducer,
            IsLoadingReducer,
            InputOutputReducer,
            MaterialReducer,
            externalReducer || {}
        ),
        {
            limit: 10,
            filter: excludeAction(MATERIALS_UPDATE_INDEX)
        },
    )
};
