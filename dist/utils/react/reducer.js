export function createReducer(initialState, ...handlers) {
    let allHandlers = {};
    handlers.forEach((reducer) => {
        allHandlers = Object.assign(allHandlers, reducer);
    });
    // best-practice redux convention clashes with airbnb style guide
    // https://stackoverflow.com/questions/45658610/redux-initial-state-as-first-parameter-is-a-bad-practice
    // but generally we want to avoid default params first
    // eslint-disable-next-line default-param-last
    return (state = initialState, action) => {
        // eslint-disable-next-line no-prototype-builtins
        if (allHandlers.hasOwnProperty(action.type)) {
            return allHandlers[action.type](state, action);
        }
        return state;
    };
}
