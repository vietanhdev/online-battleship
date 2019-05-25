import messageConstants from './constants'

const initState = {
    partner: {
        fullname: "",
        email: "",
        bio: "",
        public_id: ""
    },
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
        case messageConstants.SET_PARTNER:
            action.payload.fullname = action.payload.username;
        return {...state, partner: action.payload}
        default:
            return state
    }
}