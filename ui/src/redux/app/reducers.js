import getSidebarNavItems from "../../data/sidebar-nav-items";

const initState = {
    menuVisible: false,
    navItems: getSidebarNavItems()
}

export const appReducer = (state = initState, action) => {
    switch (action.type) {
        case 'TOGGLE':
            return {
                message: action.payload
            }
        default:
            return state
    }
}