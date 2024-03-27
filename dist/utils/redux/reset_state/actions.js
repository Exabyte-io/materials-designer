export const RESET_STATE = "RESET_STATE";
export function resetState(initialState, dispatch) {
    return {
        type: RESET_STATE,
        initialState,
        dispatch,
    };
}
