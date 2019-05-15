import userConstants from './constants'

const initState = {
    
}

export const userReducer = (state = initState, action) => {
    switch (action.type) {
        case userConstants.NOTIFY_SUCCESS:
            return {
                message: action.payload
            }
        default:
            return state
    }
}