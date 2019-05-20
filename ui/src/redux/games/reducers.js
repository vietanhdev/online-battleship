import gameConstants from './constants'

const initState = {
    gameList: [],
    roomInfo: {
        game: {
            name: ""
        }
    }
}

export const gameReducer = (state = initState, action) =>  {
    switch (action.type) {
        case gameConstants.FETCH_GAMES_SUCCESS:
            return {...state, gameList: action.payload}
        case gameConstants.ENTER_ROOM_SUCCESS:
            return {...state, roomInfo: action.payload}
        default:
            return state
    }
}