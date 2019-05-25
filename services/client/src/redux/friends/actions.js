import request from '../../utilities/http'
import friendConstants from './constants'

import {notifierActions} from '../notifier/actions'

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

        request.post('/users/friendships/' + userId)
        .then((response) => {
            let friends = response.data.data;
            dispatch({
                type: friendConstants.FOLLOW_FRIENDS_SUCCESS,
                payload: friends
            });
            
            notifierActions.showInfo("Followed new friend.");

            dispatch(friendActions.fetchFriendList());
        })
        .catch((error) => {
            dispatch({
                type: friendConstants.FOLLOW_FRIENDS_FAIL,
                payload: error
            });

            console.log(error);

            notifierActions.showError(error);
        })
    }

}