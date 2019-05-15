import {appConstants} from "./contants"

export const appActions = {
    toggleSidebar: () => dispatch => {
        dispatch({
            type: appConstants.TOGGLE_SIDEBAR
        })
    }
}