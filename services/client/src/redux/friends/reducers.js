import friendConstants from './constants'

const initState = {
    followings: [
    ],
    followers: [
    ],
}

export const friendReducer = (state = initState, action) =>  {
    switch (action.type) {
        case friendConstants.FETCH_FOLLOWINGS_SUCCESS:
        
            // Add photo and turn username into fullname
            for (let i = 0; i < action.payload.length; ++i) {
                action.payload[i].image = require('../../images/avatars/king.png');
                action.payload[i].fullname = action.payload[i].username;
            }

            return {...state, followings: action.payload}
        case friendConstants.FETCH_FOLLOWERS_SUCCESS:
        
            // Add photo and turn username into fullname
            for (let i = 0; i < action.payload.length; ++i) {
                action.payload[i].image = require('../../images/avatars/king.png');
                action.payload[i].fullname = action.payload[i].username;
            }

            console.log(action.payload)

            return {...state, followers: action.payload}
        default:
            return state
    }
}