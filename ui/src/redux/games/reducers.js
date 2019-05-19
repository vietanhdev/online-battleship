import gameConstants from './constants'
import {notifierActions} from '../notifier/actions'

const initState = {
    gameList : []
}

export const gameReducer = (state = initState, action) =>  {
    switch (action.type) {
        case gameConstants.FETCH_GAMES_SUCCESS:
            return {...state, gameList: action.payload}
        default:
            return state
    }
}