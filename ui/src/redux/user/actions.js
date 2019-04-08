import httpService from '../services/http'
import userConstants from './constants'

export const userActions = {
    register: (name, email, password)  => {
        return function (dispatch){
            httpService.post('/users',
                {
                    "name": name,
                    "email": email,
                    "password": password
                }
            ).then(function (response) {
                console.log(response);
                dispatch({
                    type: userConstants.LOGIN_SUCCESS
                });
            })
            .catch(function (error) {
                dispatch({
                    type: userConstants.LOGIN_FAIL
                });
            });
        }
    }
}