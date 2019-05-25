import request, {
    requestStatus
} from '../../utilities/http'
import battleshipConstants from './constants'

import {
    notifierActions
} from '../notifier/actions'

export const battleshipActions = {

    login: () => (dispatch, getState, socket) =>  {
        // Login
        socket.gameRoom.emit('request_login', {
            'authorization': getState().userReducer.token
        }) 
    },


    getPartnerInfo: (partnerId) => (dispatch, getState, socket) =>  {
        // Load old battleships
        request.get("/users/" + partnerId)
        .then((response) => {
            let partner = response.data.data;

            dispatch({
                type: battleshipConstants.SET_PARTNER,
                payload: partner
            });

        })
        .catch((error) => {
            // Clear battleships
            dispatch(battleshipActions.clearMessages());
            notifierActions.showError("Error on getting partner info");
        })
    },

    initSocket: (roomId) => {
        return (dispatch, getState, socket) => {
            // Get partner info from roomId (also partner id)
            dispatch(battleshipActions.getPartnerInfo(roomId));

            // Remove all listeners
            socket.gameRoom.removeListener('response_login');
            socket.gameRoom.removeListener('receive_battleship');

            // ====== Reinit listeners =======

            // Login response
            socket.gameRoom.on('response_login', function (data) {
                if (data.status !== requestStatus.SUCCESS) {
                    notifierActions.showError("Could not join the chat room.");
                } else {
                    console.log('Authorized successfully.')
                }
            });

            // Receive battleship from server
            socket.gameRoom.on('new_battleship', (battleship) => {
                dispatch(battleshipActions.pushNewMessage(battleship));
            });

            dispatch(battleshipActions.login());
        }
    },


    sendMessage: (roomId, content) => (dispatch, getState, socket) => {
        let msgContent =  {
            'receiver_public_id': roomId,
            'content': content
          };
          socket.gameRoom.emit("send_battleship", msgContent);
    },
    
    

    clearMessages: () => dispatch => {
        dispatch({
            type: battleshipConstants.CLEAR_BATTLESHIPS
        });
    },


    fetchAllMessages: (roomId) => dispatch => {

        // Load old battleships
        request.get("/battleships/" + roomId + "?offset=0&limit=20")
            .then((response) => {
                let battleships = response.data.data;

                // Sort battleships by time
                battleships = battleships.sort(function (x, y) {
                    if (parseFloat(x.created_at) < parseFloat(y.created_at)) return -1;
                    if (parseFloat(x.created_at) > parseFloat(y.created_at)) return 1;
                    return 0;
                });

                dispatch({
                    type: battleshipConstants.FETCH_BATTLESHIPS_SUCCESS,
                    payload: battleships
                });

            })
            .catch((error) => {
                // Clear battleships
                dispatch(battleshipActions.clearMessages());
                notifierActions.showError("Error on fetching battleships");
            })
    },


    pushNewMessage: (content) => dispatch => {
        dispatch({
            type: battleshipConstants.PUSH_NEW_BATTLESHIP,
            payload: content
        });
    }

}