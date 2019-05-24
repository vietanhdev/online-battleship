import friendConstants from './constants'

const initState = {
    friends: [
    ]
}

export const friendReducer = (state = initState, action) =>  {
    switch (action.type) {
        case friendConstants.FETCH_FRIENDS_SUCCESS:
        
            // Add photo and turn username into fullname
            for (let i = 0; i < action.payload.length; ++i) {
                action.payload[i].image = require('../../images/avatars/king.png');
                action.payload[i].fullname = action.payload[i].username;
            }

            return {...state, friends: action.payload}
        default:
            return state
    }
}