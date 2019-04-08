import httpService from '../services/http'
import userConstants from './constants'

export const userActions = {
    register: (name, email, password)  => {
        return function (dispatch){
            httpService.post('/users',
                {
                    "username": name,
                    "email": email,
                    "password": password
                }
            ).then(function (response) {
                dispatch({
                    type: userConstants.REGISTER_SUCCESS,
                    token: response.data["Authorization"]
                });
            })
            .catch(function (error) {

                if (error.response) {
                    let message = error.response.data.message
                    dispatch({
                        type: userConstants.REGISTER_FAIL,
                        message: message
                    });
                    console.log("Dispatch: " + message)
                }
                
            });
        }
    }
}