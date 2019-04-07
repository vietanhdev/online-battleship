import notifierConstants from './constants'

const initState = {
    message: ""
}

export const notifierReducer = (state = initState, action) => {
    switch (action.type) {
        case notifierConstants.NOTIFY_SUCCESS:
            return {
                message: action.payload
            }
        default:
            return state
    }
}