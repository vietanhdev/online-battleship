import request from '../services/http'
import friendConstants from './constants'

export const friendActions = {

    fetchFriendList: ()  => dispatch => {
        request.get('/users/followings')
        .then(function (response) {
            let friends = response.data.data;
            dispatch({
                type: friendConstants.FETCH_FRIENDS_SUCCESS,
                payload: friends
            });
        })
        .catch(function (error) {
            dispatch({
                type: friendConstants.FETCH_FRIENDS_FAIL,
                payload: error
            });
        })
    },


    // Follow friend
    follow: (userId)  => dispatch => {

        request.post('/users/followings/' + userId)
        .then(function (response) {
            let friends = response.data.data;
            dispatch({
                type: friendConstants.FOLLOW_FRIENDS_SUCCESS,
                payload: friends
            });
        })
        .catch(function (error) {
            dispatch({
                type: friendConstants.FOLLOW_FRIENDS_FAIL,
                payload: error
            });
        })
    }

}