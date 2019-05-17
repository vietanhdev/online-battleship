import request from '../services/http'
import userConstants from './constants'

export const userActions = {
    register: (name, email, password)  => {
        return function (dispatch){
            request('post', '/users',
                {
                    username: name,
                    email: email,
                    password: password,
                    bio: ""
                }
            )
            .onSuccess(function (response) {
                dispatch({
                    type: userConstants.REGISTER_SUCCESS
                });
            })
            .onError(function (error) {
                dispatch({
                    type: userConstants.REGISTER_FAIL,
                    payload: error
                });
            })
            
        }
    },
    login: (email, password, history)  => dispatch => {
        request('post', '/auth',
            {
                "email": email,
                "password": password
            }
        ).onSuccess(function (response) {
            console.log(response)
            dispatch({
                type: userConstants.LOGIN_SUCCESS,
                payload: {
                    fullname: response.data["data"]["username"],
                    bio: response.data["data"]["bio"],
                    email: response.data["data"]["email"],
                    token:  response.data["data"]["token"]
                }
            });
            history.push("/")
        })
        .onError(function (error) {
            dispatch({
                type: userConstants.LOGIN_FAIL,
                payload: error
            });
        })
    },
    logout: ()  => dispatch => {
        request('post', '/auth', null, true
        ).onSuccess(function (response) {
            console.log(response)
            dispatch({
                type: userConstants.LOGOUT_SUCCESS
            });
        })
        .onError(function (error) {
            dispatch({
                type: userConstants.LOGOUT_FAIL,
                payload: error
            });
        })
    }
}