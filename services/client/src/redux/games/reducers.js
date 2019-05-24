import gameConstants from './constants'

const initState = {
    gameList: [],
    roomList: [],
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
        case gameConstants.FETCH_GAME_ROOMS_SUCCESS:
            return {...state, roomList: action.payload}
        default:
            return state
    }
}