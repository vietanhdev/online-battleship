import httpService from '../services/http'
import userConstants from './constants'

export const userActions = {
    register: (name, email, password)  => {
        return function (dispatch){
            httpService.post('/users',
                {
                    username: name,
                    email: email,
                    password: password,
                    bio: ""
                }
            )
            .then(function (response) {
                dispatch({
                    type: userConstants.REGISTER_SUCCESS
                });
            })
            .catch(function (error) {
                console.log(error)
                if (error.response) {
                    try {
                        let message = JSON.parse(error.response.data).message
                        dispatch({
                            type: userConstants.REGISTER_FAIL,
                            payload: message
                        });
                    } catch (e) {
                        dispatch({
                            type: userConstants.REGISTER_FAIL,
                            payload: "Unknown Error."
                        });
                    }
                }
            })
            
        }
    },
    login: (email, password, history)  => dispatch => {
        httpService.post('/auth',
            {
                "email": email,
                "password": password
            }
        ).then(function (response) {
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
        .catch(function (error) {
            console.log(error)
            if (error.response) {
                try {
                    let message = JSON.parse(error.response.data).message
                    dispatch({
                        type: userConstants.REGISTER_FAIL,
                        payload: message
                    });
                } catch (e) {
                    dispatch({
                        type: userConstants.REGISTER_FAIL,
                        payload: "Unknown Error."
                    });
                }
            }
        });
    }
}