import chatConstants from './constants'

const initState = {
    chatList: [],
    roomInfo: {
        chat: {
            name: ""
        }
    }
}

export const chatReducer = (state = initState, action) =>  {
    switch (action.type) {
        case chatConstants.FETCH_GAMES_SUCCESS:
            return {...state, chatList: action.payload}
        case chatConstants.ENTER_ROOM_SUCCESS:
            return {...state, roomInfo: action.payload}
        default:
            return state
    }
}