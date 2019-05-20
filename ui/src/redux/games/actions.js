import request from '../services/http'
import gameConstants from './constants'

export const gameActions = {

    fetchGameList: ()  => dispatch => {
        request.get('/games/')
        .then(function (response) {
            let games = response.data.data;
            console.log(games);
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

    },


    createRoom: (gameId)  => dispatch => {
        
    }

}