import userConstants from './constants'
import {notifierActions} from '../notifier/actions'


function getUserFromSessStorage() {
    let user = localStorage.getItem("user");
    try {
        user = JSON.parse(user); 
    } catch(e) {
        user = {
            fullname: sessionStorage.hasItem,
            email: "",
            bio: "The best gamer on the Earth.",
            isLoggedIn: false,
            token: ""
        }
    }
    return user;
}

const initState = getUserFromSessStorage();

export const userReducer = (state = initState, action) =>  {
    switch (action.type) {
        case userConstants.REGISTER_FAIL:
            notifierActions.dismissAlert();
            notifierActions.showError(action.payload);
            return state;
        case userConstants.REGISTER_SUCCESS:
            notifierActions.dismissAlert();
            notifierActions.showMessage("Successfully registered!");
            return state;
        case userConstants.LOGIN_FAIL:
            notifierActions.dismissAlert();
            notifierActions.showError(action.payload);
            return state;
        case userConstants.LOGIN_SUCCESS:
            notifierActions.dismissAlert();
            notifierActions.showMessage("Successfully logged in!");

            let user = {
                fullname: action.payload.fullname,
                bio: action.payload.bio,
                email: action.payload.email,
                token: action.payload.token,
                isLoggedIn: true
            }
            
            // Save info in session storage
            localStorage.setItem("user", JSON.stringify(user));

            return Object.assign({}, state, user)
        default:
            return state
    }
}