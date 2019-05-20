import request from '../services/http'
import gameConstants from './constants'

import {appActions} from '../app/actions'
import {notifierActions} from '../notifier/actions'

export const gameActions = {

    fetchGameList: ()  => dispatch => {
        request.get('/games/')
        .then(function (response) {
            let games = response.data.data;
            dispatch({
                type: gameConstants.FETCH_GAMES_SUCCESS,
                payload: games
            });
        })
        .catch(function (error) {

            notifierActions.showError("Fetching games failed!");

            dispatch({
                type: gameConstants.FETCH_GAMES_FAIL,
                payload: error
            });
        })

    },

    createRoom: (gameId, history)  => dispatch => {

        // Show loading sreen first
        dispatch(appActions.openLoadingScreen());

        // Create new room
        request.post('/games/rooms', {game_public_id: gameId})
        .then(function (response) {
            let room_public_id = response.data.room_public_id;
            dispatch({
                type: gameConstants.CREATE_GAME_ROOM_SUCCESS,
                payload: room_public_id
            });

            // Close loading screen
            dispatch(appActions.closeLoadingScreen());

            // Open playing page
            history.push("/games/" + gameId + "/" + room_public_id)
        })
        .catch(function (error) {
            notifierActions.showError("Creating new game failed: " + error);

            // Close loading screen
            dispatch(appActions.closeLoadingScreen());
        })

    },


    enterRoom: (roomId, history)  => dispatch => {

        // Show loading sreen first
        dispatch(appActions.openLoadingScreen());

        // Enter created room
        request.get('/games/rooms/' + roomId)
        .then(function (response) {

            let roomInfo = response.data.data;

            console.log(roomInfo);

            dispatch({
                type: gameConstants.ENTER_ROOM_SUCCESS,
                payload: roomInfo
            });

            // Close loading screen
            dispatch(appActions.closeLoadingScreen());
        })
        .catch(function (error) {
            notifierActions.showError("Error on joining room: " + error);

            // Close loading screen
            dispatch(appActions.closeLoadingScreen());

            // Return to Games page
            history.push("/games")
        })


    }

}