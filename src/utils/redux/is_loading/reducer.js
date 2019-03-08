import {IS_LOADING_SET} from "./actions";

function isLoadingSet(state, action) {
    return Object.assign({}, state, {isLoading: action.isLoading});
}

export default {
    [IS_LOADING_SET]: isLoadingSet,
}
