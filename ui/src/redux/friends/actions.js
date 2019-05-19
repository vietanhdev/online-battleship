import request from '../services/http'
import friendConstants from './constants'

export const friendActions = {

    fetchFriendList: ()  => dispatch => {
        // request.post('/friends')
        // .then(function (response) {
        //     let friends = response.data;
        //     dispatch({
        //         type: friendConstants.FETCH_FRIENDS_SUCCESS,
        //         payload: friends
        //     });
        // })
        // .catch(function (error) {
        //     dispatch({
        //         type: friendConstants.FETCH_FRIENDS_FAIL,
        //         payload: error
        //     });
        // })


        // Use this temporary because of an API bug
        let friends =  [{
                "public_id": "5087ec3d-3660-4c93-84f1-349fcc7107b6",
                "name": "battle ship",
                "image": require("../../images/battleship.svg"),
                "num_players": 2
            }]
        dispatch({
            type: friendConstants.FETCH_FRIENDS_SUCCESS,
            payload: friends
        });
    }

}