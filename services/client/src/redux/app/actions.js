import {appConstants} from "./contants"

export const appActions = {
    toggleSidebar: () => dispatch => {
        dispatch({
            type: appConstants.TOGGLE_SIDEBAR
        })
    },
    openLoadingScreen: (loading) => dispatch => {
        dispatch({
            type: appConstants.SET_LOADING,
            payload: true
        });
    },
    closeLoadingScreen: (loading) => dispatch => {
        dispatch({
            type: appConstants.SET_LOADING,
            payload: false
        });
    }
}