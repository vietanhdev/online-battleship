import getSidebarNavItems from "../../data/sidebar-nav-items";
import {appConstants} from "./contants"

const initState = {
    menuVisible: false,
    navItems: getSidebarNavItems(),
    isLoading: false
}

export const appReducer = (state = initState, action) => {
    switch (action.type) {
        case appConstants.TOGGLE_SIDEBAR:
            return Object.assign({}, state, {
                menuVisible: !state.menuVisible
            })
        case appConstants.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        default:
            return state
    }
}