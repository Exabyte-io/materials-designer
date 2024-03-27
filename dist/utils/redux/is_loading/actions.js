export const IS_LOADING_SET = "IS_LOADING_SET";
export function setIsLoading(isLoading, dispatch) {
    return {
        type: IS_LOADING_SET,
        isLoading,
        dispatch,
    };
}
