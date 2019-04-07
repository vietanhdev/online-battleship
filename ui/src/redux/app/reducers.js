import getSidebarNavItems from "../../data/sidebar-nav-items";
import {appConstants} from "./contants"

const initState = {
    menuVisible: false,
    navItems: getSidebarNavItems()
}

export const appReducer = (state = initState, action) => {
    switch (action.type) {
        case appConstants.TOGGLE_SIDEBAR:
            return Object.assign({}, state, {
                menuVisible: !state.menuVisible
            })
        default:
            return state
    }
}