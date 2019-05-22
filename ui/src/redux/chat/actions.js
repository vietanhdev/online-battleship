import request from '../services/http'
import chatConstants from './constants'

import {appActions} from '../app/actions'
import {notifierActions} from '../notifier/actions'

export const chatActions = {
    

    fetchchatList: ()  => dispatch => {
        request.get('/chats/')
        .then(function (response) {
            let chats = response.data.data;
            dispatch({
                type: chatConstants.FETCH_chatS_SUCCESS,
                payload: chats
            });
        })
        .catch(function (error) {

            notifierActions.showError("Fetching chats failed!");

            dispatch({
                type: chatConstants.FETCH_chatS_FAIL,
                payload: error
            });
        })

    },

    createRoom: (chatId, history)  => dispatch => {

        // Show loading sreen first
        dispatch(appActions.openLoadingScreen());

        // Create new room
        request.post('/chats/rooms', {chat_public_id: chatId})
        .then(function (response) {
            let room_public_id = response.data.room_public_id;
            dispatch({
                type: chatConstants.CREATE_chat_ROOM_SUCCESS,
                payload: room_public_id
            });

            // Close loading screen
            dispatch(appActions.closeLoadingScreen());

            // Open playing page
            history.push("/chats/" + chatId + "/" + room_public_id)
        })
        .catch(function (error) {
            notifierActions.showError("Creating new chat failed: " + error);

            // Close loading screen
            dispatch(appActions.closeLoadingScreen());
        })

    },

    
    enterRoomFailed: (history) => {
        notifierActions.showError("Error on joining room: Could not authenticate with given token. Please try again.");
    },

    enterRoom: (roomId, history)  => dispatch => {

        // Show loading sreen first
        dispatch(appActions.openLoadingScreen());

        // Enter created room
        request.get('/chats/rooms/' + roomId)
        .then(function (response) {

            let roomInfo = response.data.data;

            dispatch({
                type: chatConstants.ENTER_ROOM_SUCCESS,
                payload: roomInfo
            });

            // Close loading screen
            dispatch(appActions.closeLoadingScreen());
        })
        .catch(function (error) {
            notifierActions.showError("Error on joining room: " + error);

            // Close loading screen
            dispatch(appActions.closeLoadingScreen());

            // Return to chats page
            history.push("/chats")
        })


    }

}