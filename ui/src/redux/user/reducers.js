import userConstants from './constants'
import {notifierActions} from '../notifier/actions'


function getUserFromSessStorage() {
    let user = localStorage.getItem("user");
    try {
        user = JSON.parse(user); 
    } catch(e) {}
    if (user == null) {
        user = {
            fullname: "",
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
    let user = {};
    switch (action.type) {
        case userConstants.UPDATE_SUCCESS:
            notifierActions.dismissAlert();
            notifierActions.showMessage("Successfully updated user profile!");

            let newUserInfo = Object.assign({}, state);
            newUserInfo.fullname = action.payload.fullname;
            newUserInfo.bio = action.payload.bio;
            newUserInfo.email = action.payload.email;

            // Save info in session storage
            localStorage.setItem("user", JSON.stringify(newUserInfo));

            return state;
        case userConstants.UPDATE_FAIL:
            notifierActions.dismissAlert();
            notifierActions.showError(action.payload);
            return state;
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

            user = {
                fullname: action.payload.fullname,
                bio: action.payload.bio,
                email: action.payload.email,
                token: action.payload.token,
                isLoggedIn: true
            }
            
            // Save info in session storage
            localStorage.setItem("user", JSON.stringify(user));

            return Object.assign({}, state, user)
        case userConstants.LOGOUT_FAIL:
        case userConstants.LOGOUT_SUCCESS:
            notifierActions.dismissAlert();
            notifierActions.showMessage("Successfully logged out! Please login again to continue.");

            user = {
                fullname: "",
                bio: "",
                email: "",
                token: "",
                isLoggedIn: false
            }
            
            // Save info in session storage
            localStorage.setItem("user", JSON.stringify(user));

            return Object.assign({}, state, user)
        default:
            return state
    }
}