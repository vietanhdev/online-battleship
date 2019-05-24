import request from '../services/http'
import userConstants from './constants'
import {notifierActions} from '../notifier/actions'

export const userActions = {
    register: (name, email, password, history)  => dispatch => {
        request.post('/users',
            {
                username: name,
                email: email,
                password: password,
                bio: ""
            }
        )
        .then(function (response) {
            notifierActions.dismissAlert();
            notifierActions.showMessage("Successfully registered!");
            history.push("/login")
        })
        .catch(function (error) {
            notifierActions.dismissAlert();
            notifierActions.showError(error);
        })
    },
    login: (email, password, history)  => dispatch => {
        request.post('/auth',
            {
                "email": email,
                "password": password
            }
        ).then(function (response) {

            notifierActions.dismissAlert();

            let user = {
                fullname: response.data["data"]["username"],
                bio: response.data["data"]["bio"],
                email: response.data["data"]["email"],
                token:  response.data["data"]["token"],
                public_id: response.data["data"]["public_id"]
            }

            dispatch({
                type: userConstants.LOGIN_SUCCESS,
                payload: user
            });
            history.push("/")
        })
        .catch(function (error) {
            notifierActions.dismissAlert();
            notifierActions.showError(error);
        })
    },
    logout: (history)  => dispatch => {
        request.delete('/auth'
        ).then(function (response) {
            dispatch({
                type: userConstants.LOGOUT_SUCCESS
            });
            history.push("/login")
        })
        .catch(function (error) {
            dispatch({
                type: userConstants.LOGOUT_FAIL,
                payload: error
            });
            history.push("/login")
        });

        let user = {
            fullname: "",
            bio: "",
            email: "",
            token: "",
            isLoggedIn: false
        }
        
        // Save info in session storage
        localStorage.setItem("user", JSON.stringify(user));

        notifierActions.dismissAlert();
        notifierActions.showMessage("Successfully logged out! Please login again to continue.");
    },
    update: (user)  => dispatch => {
        if (user.new_password === "" || user.old_password === "") {
            delete user.new_password;
            delete user.old_password;
        }

        // Fix field name
        user.username = user.fullname;

        request.put('/users/my_account', user
        ).then(function (response) {

            notifierActions.dismissAlert();
            notifierActions.showMessage("Successfully updated user profile!");

            dispatch({
                type: userConstants.UPDATE_SUCCESS,
                payload: user
            });
        })
        .catch(function (error) {

            notifierActions.dismissAlert();
            notifierActions.showError(error);

        })
    }
}