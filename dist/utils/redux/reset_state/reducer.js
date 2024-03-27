import { RESET_STATE } from "./actions";
function stateReset(state, action) {
    return { ...state, ...action.initialState };
}
export default {
    [RESET_STATE]: stateReset,
};
