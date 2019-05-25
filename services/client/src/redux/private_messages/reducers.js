import messageConstants from './constants'

const initState = {
    messages: []
}

export const privateMessageReducer = (state = initState, action) =>  {
    switch (action.type) {
        case messageConstants.CLEAR_MESSAGES:
            return {...state, messages: []}
        case messageConstants.FETCH_MESSAGES_SUCCESS:
            return {...state, messages: action.payload}
        case messageConstants.PUSH_NEW_MESSAGE:
            return {...state, messages: [...state.messages, action.payload]}
        default:
            return state
    }
}