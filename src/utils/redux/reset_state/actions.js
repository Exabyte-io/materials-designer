import { ActionCreators } from "redux-undo";

export const RESET_STATE = "RESET_STATE";

export function resetState(initialState) {
    return (dispatch) => {
        dispatch({
            type: RESET_STATE,
            initialState,
        });

        dispatch(ActionCreators.clearHistory());
    };
}
