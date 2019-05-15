import userConstants from './constants'
import {notifierActions} from '../notifier/actions'

const initState = {
    fullname: "",
    email: "",
    bio: "The best gamer on the Earth.",
    isLoggedIn: false,
    authKey: ""
}

export const userReducer = (state = initState, action) => dispatch => {
    switch (action.type) {
        case userConstants.REGISTER_SUCCESS:
            notifierActions.dismissAlert();
            notifierActions.showMessage("Successfully registered!");
            return state;
        case userConstants.REGISTER_FAIL:
            notifierActions.dismissAlert();
            notifierActions.showError(action.message);
            return state;
        default:
            return state
    }
}