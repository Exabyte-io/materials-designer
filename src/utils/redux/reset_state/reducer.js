import {RESET_STATE} from "./actions";

function stateReset(state, action) {
    return Object.assign({}, state, action.initialState);
}

export default {
    [RESET_STATE]: stateReset,
}
