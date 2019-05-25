import request, {
    requestStatus
} from '../../utilities/http'
import messageConstants from './constants'

import {
    notifierActions
} from '../notifier/actions'

export const messageActions = {

    login: (roomId) => (dispatch, getState, socket) =>  {
        // Login
        socket.gameRoomMessage.emit('request_login', {
            'authorization': getState().userReducer.token,
            'room_public_id': roomId
        }) 
    },

    initSocket: (roomId) => {
        return (dispatch, getState, socket) => {

            // Remove all listeners
            socket.gameRoomMessage.removeListener('response_login');
            socket.gameRoomMessage.removeListener('new_message');

            // ====== Reinit listeners =======

            // Login response
            socket.gameRoomMessage.on('response_login', function (data) {
                if (data.status !== requestStatus.SUCCESS) {
                    notifierActions.showError("Could not join the chat room.");
                } else {
                    console.log('Authorized successfully.')
                }
            });

            // Receive message from server
            socket.gameRoomMessage.on('new_message', (message) => {
                dispatch(messageActions.pushNewMessage(message));
            });

            dispatch(messageActions.login(roomId));
        }
    },


    sendMessage: (roomId, content) => (dispatch, getState, socket) => {
        let msgContent =  {
            'content': content
          };
          socket.gameRoomMessage.emit("send_message", msgContent);
    },
    
    

    clearMessages: () => dispatch => {
        dispatch({
            type: messageConstants.CLEAR_MESSAGES
        });
    },


    fetchAllMessages: (roomId) => dispatch => {

        // Load old messages
        request.get("/messages/" + roomId + "?offset=0&limit=20")
            .then((response) => {
                let messages = response.data.data;

                // Sort messages by time
                messages = messages.sort(function (x, y) {
                    if (parseFloat(x.created_at) < parseFloat(y.created_at)) return -1;
                    if (parseFloat(x.created_at) > parseFloat(y.created_at)) return 1;
                    return 0;
                });

                dispatch({
                    type: messageConstants.FETCH_MESSAGES_SUCCESS,
                    payload: messages
                });

            })
            .catch((error) => {
                // Clear messages
                dispatch(messageActions.clearMessages());
                notifierActions.showError("Error on fetching messages");
            })
    },


    pushNewMessage: (content) => dispatch => {
        dispatch({
            type: messageConstants.PUSH_NEW_MESSAGE,
            payload: content
        });
    }

}