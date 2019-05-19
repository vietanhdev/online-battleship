import friendConstants from './constants'
import {notifierActions} from '../notifier/actions'

const initState = {
    friendList : []
}

export const friendReducer = (state = initState, action) =>  {
    switch (action.type) {
        case friendConstants.FETCH_FRIENDS_SUCCESS:
            return {...state, friendList: action.payload}
        default:
            return state
    }
}