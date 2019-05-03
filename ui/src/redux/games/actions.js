import request from '../services/http'
import gameConstants from './constants'

export const gameActions = {

    fetchGameList: ()  => dispatch => {
        request.post('/games')
        .then(function (response) {
            let games = response.data;
            dispatch({
                type: gameConstants.FETCH_GAMES_SUCCESS,
                payload: games
            });
        })
        .catch(function (error) {
            dispatch({
                type: gameConstants.FETCH_GAMES_FAIL,
                payload: error
            });
        })


        // // Use this temporary because of an API bug
        // let games =  [{
        //         "public_id": "5087ec3d-3660-4c93-84f1-349fcc7107b6",
        //         "name": "battle ship",
        //         "image": require("../../images/battleship.svg"),
        //         "num_players": 2
        //     }]
        // dispatch({
        //     type: gameConstants.FETCH_GAMES_SUCCESS,
        //     payload: games
        // });
    },


    createRoom: (gameId)  => dispatch => {
        
    }

}