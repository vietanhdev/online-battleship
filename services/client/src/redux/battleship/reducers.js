import battleshipConstants from './constants'

const initState = {
    loadingScreen: true
}

export const battleshipReducer = (state = initState, action) =>  {
    switch (action.type) {
        case battleshipConstants.CLEAR_BATTLESHIPS:
            return {...state, battleships: []}
        case battleshipConstants.FETCH_BATTLESHIPS_SUCCESS:
            return {...state, battleships: action.payload}
        case battleshipConstants.PUSH_NEW_BATTLESHIP:
            return {...state, battleships: [...state.battleships, action.payload]}
        case battleshipConstants.SET_PARTNER:
            action.payload.fullname = action.payload.username;
        return {...state, partner: action.payload}
        default:
            return state
    }
}