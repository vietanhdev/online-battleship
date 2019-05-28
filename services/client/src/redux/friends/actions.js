import request from '../../utilities/http'
import friendConstants from './constants'

import {notifierActions} from '../notifier/actions'

export const friendActions = {

    fetchFriendList: ()  => dispatch => {
        request.get('/users/followings')
        .then(function (response) {
            let followings = response.data.data;
            if (followings === null) followings = []; 
            dispatch({
                type: friendConstants.FETCH_FOLLOWINGS_SUCCESS,
                payload: followings
            });
        })
        .catch(function (error) {
            notifierActions.showError(error);
            console.log(error);
        });

        request.get('/users/followers')
        .then(function (response) {
            let followers = response.data.data;
            if (followers === null) followers = []; 
            dispatch({
                type: friendConstants.FETCH_FOLLOWERS_SUCCESS,
                payload: followers
            });
        })
        .catch(function (error) {
            notifierActions.showError(error);
            console.log(error);
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
            notifierActions.showError(error);
        })
    }

}