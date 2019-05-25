import request, {
    requestStatus
} from '../../utilities/http'
import messageConstants from './constants'

import {
    notifierActions
} from '../notifier/actions'

export const messageActions = {

    login: () => (dispatch, getState, socket) =>  {
        // Login
        socket.message.emit('request_login', {
            'authorization': getState().userReducer.token
        }) 
    },


    getPartnerInfo: (partnerId) => (dispatch, getState, socket) =>  {
        // Load old messages
        request.get("/users/" + partnerId)
        .then((response) => {
            let partner = response.data.data;

            dispatch({
                type: messageConstants.SET_PARTNER,
                payload: partner
            });

        })
        .catch((error) => {
            // Clear messages
            dispatch(messageActions.clearMessages());
            notifierActions.showError("Error on getting partner info");
        })
    },

    initSocket: (roomId) => {
        return (dispatch, getState, socket) => {
            // Get partner info from roomId (also partner id)
            dispatch(messageActions.getPartnerInfo(roomId));

            // Remove all listeners
            socket.message.removeListener('response_login');
            socket.message.removeListener('receive_message');

            // ====== Reinit listeners =======

            // Login response
            socket.message.on('response_login', function (data) {
                if (data.status !== requestStatus.SUCCESS) {
                    notifierActions.showError("Could not join the chat room.");
                } else {
                    console.log('Authorized successfully.')
                }
            });

            // Receive message from server
            socket.message.on('new_message', (message) => {
                dispatch(messageActions.pushNewMessage(message));
            });

            dispatch(messageActions.login());
        }
    },


    sendMessage: (roomId, content) => (dispatch, getState, socket) => {
        let msgContent =  {
            'receiver_public_id': roomId,
            'content': content
          };
          socket.message.emit("send_message", msgContent);
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