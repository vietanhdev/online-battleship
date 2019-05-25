import request, {
    requestStatus
} from '../../utilities/http'
import battleshipConstants, {ShipSize} from './constants'

import {
    notifierActions
} from '../notifier/actions'

export const battleshipActions = {

    login: (roomId) => (dispatch, getState, socket) =>  {
        // Login
        socket.gameRoom.emit('request_login', {
            'authorization': getState().userReducer.token,
            'room_public_id': roomId
        }) 
    },


    selectShipSize: (size) => dispatch =>  {
        if (size < ShipSize.SMALL) size = ShipSize.SMALL;
        if (size > ShipSize.GIGANT) size = ShipSize.GIGANT;
        dispatch({
            type: battleshipConstants.SELECT_SHIP_SIZE,
            payload: size
        });
    },


    toggleShipRotate: () => dispatch => {
        dispatch({
            type: battleshipConstants.TOGGLE_SHIP_ROTATE
        });
    },


    getOpponentInfo: (opponentId) => (dispatch, getState, socket) =>  {

        request.get("/users/" + opponentId)
        .then((response) => {
            let opponent = response.data.data;

            dispatch({
                type: battleshipConstants.SET_OPPONENT,
                payload: opponent
            });

        })
        .catch((error) => {
            // Clear battleships
            dispatch(battleshipActions.clearMessages());
            notifierActions.showError("Error on getting opponent info");
        })

    },

    initSocket: (roomId) => {
        return (dispatch, getState, socket) => {

            // Remove all listeners
            socket.gameRoom.removeListener('response_login');
            // socket.gameRoom.removeListener('receive_battleship');

            // ====== Reinit listeners =======

            // Login response
            socket.gameRoom.on('response_login', function (data) {
                if (data.status !== requestStatus.SUCCESS) {
                    console.log(data)
                    notifierActions.showError("Could not join the game room.");
                } else {
                    console.log('Authorized successfully.')
                }
            });

            // Receive battleship from server
            socket.gameRoom.on('receive_event', (data) => {
                console.log(data)
            });

            dispatch(battleshipActions.login(roomId));
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



    pushNewMessage: (content) => dispatch => {
        dispatch({
            type: battleshipConstants.PUSH_NEW_BATTLESHIP,
            payload: content
        });
    }

}