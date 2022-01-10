export function createReducer(initialState, ...handlers) {
    let allHandlers = {};
    handlers.forEach((reducer) => {
        allHandlers = Object.assign(allHandlers, reducer);
    });

    return function (state = initialState, action) {
        if (allHandlers.hasOwnProperty(action.type)) {
            return allHandlers[action.type](state, action);
        }
        return state;
    };
}
