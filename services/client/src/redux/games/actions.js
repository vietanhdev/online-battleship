import request from '../../utilities/http'
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

    // Create new game room
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


    // Send friend an invitation to game room
    inviteFriend: (roomId, friendId)  => dispatch => {
        // Invite friend using message
        request.post('/messages/invitations/' + friendId, {invitation_link: window.location.protocol + "//" + window.location.hostname + "/games/battle_ship/" + roomId})
        .then(function (response) {
            
        })
        .catch(function (error) {
            notifierActions.showError("Could not invite your friend: " + error);
        })
    },


    // Create new game room and invite friend to that room
    createRoomWithFriend: (gameId, friendId, history)  => dispatch => {

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

            // Send invitation to friend
            dispatch(gameActions.inviteFriend(room_public_id, friendId));

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


    fetchRoomList: (offset = 0, limit = 200)  => dispatch => {

        // Create new room
        request.get('/games/rooms?offset=' + offset + "&limit=" + limit)
        .then(function (response) {
            let gameRooms = response.data.data;
            dispatch({
                type: gameConstants.FETCH_GAME_ROOMS_SUCCESS,
                payload: gameRooms
            });

        })
        .catch(function (error) {
            notifierActions.showError("Fetching game rooms failed: " + error);
        });

    },

    
    enterRoomFailed: (history) => {
        notifierActions.showError("Error on joining room: Could not authenticate with given token. Please try again.");

        // Return to Games page
        history.push("/games")
    },

    enterRoom: (roomId, history)  => dispatch => {

        console.log("Entering room")

        // Show loading sreen first
        dispatch(gameActions.openLoadingScreen());

        // Enter created room
        request.get('/games/rooms/' + roomId)
        .then(function (response) {

            let roomInfo = response.data.data;

            dispatch({
                type: gameConstants.ENTER_ROOM_SUCCESS,
                payload: roomInfo
            });

            // Close loading screen
            dispatch(gameActions.closeLoadingScreen());
        })
        .catch(function (error) {
            notifierActions.showError("Error on joining room: " + error);

            // Close loading screen
            dispatch(gameActions.closeLoadingScreen());

            // Return to Games page
            history.push("/games")
        })

    },


    openLoadingScreen: () => dispatch => {
        dispatch({
            type: gameConstants.SET_LOADING,
            payload: true
        });
    },

    closeLoadingScreen: () => dispatch => {
        dispatch({
            type: gameConstants.SET_LOADING,
            payload: false
        });
    }

}