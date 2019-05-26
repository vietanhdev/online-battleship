import request, {
    requestStatus
} from '../../utilities/http'
import battleshipConstants, {ShipSize, MessageEvent} from './constants'

import {
    notifierActions
} from '../notifier/actions'


import Utilities from './utilities'

export const battleshipActions = {

    login: (roomId) => (dispatch, getState, socket) =>  {
        // Login
        socket.gameRoom.emit('request_login', {
            'authorization': getState().userReducer.token,
            'room_public_id': roomId
        }) 
    },

    // Select ship size in UI
    selectShipSize: (size) => (dispatch, getState) =>  {
        dispatch({
            type: battleshipConstants.SELECT_SHIP_SIZE,
            payload: size
        });
    },


    // Put a ship in board
    putShip: (x, y) => (dispatch, getState) =>  {

        let ships = getState().battleshipReducer.gameState.player1.ships;
        let selectedShipSize = getState().battleshipReducer.shipArrangement.selectedShipSize;
        let maxNumberOfShips = getState().battleshipReducer.gameState.maxNumberOfShips;
        let boardWidth = getState().battleshipReducer.gameState.boardWidth;
        let boardheight = getState().battleshipReducer.gameState.boardHeight;
        let shipVertical = getState().battleshipReducer.shipArrangement.vertical;
        let shipLength = Utilities.shipSize2Length(selectedShipSize);


        // Check number of ship
        if (Utilities.countShip(ships, selectedShipSize) >= maxNumberOfShips[selectedShipSize]) {
            // notifierActions.showError("You cannot put more ship of that type. Please choose another type.");
            return;
        }

        // Check position of ship
        if (x < 0 || x >= boardWidth || y < 0 || y >= boardheight) {
            notifierActions.showError("Wrong ship position. Please choose another position.");
            return;
        }
        if ((shipVertical && y + shipLength >= boardheight) || (!shipVertical && x + shipLength >= boardWidth)) {
            notifierActions.showError("Wrong ship position. Please choose another position.");
            return;
        }

        console.log(boardheight)

        // Check ship collision
        let coverageBoard = Utilities.createCoverageBoard(boardWidth, boardheight, ships);
        if (coverageBoard[x][y]) {
            notifierActions.showError("We cannot put other ship here.");
            return;
        }

        // Add ship to the board
        dispatch({
            type: battleshipConstants.ADD_SHIP,
            payload: {
                x: x,
                y: y,
                vertical: shipVertical,
                size: selectedShipSize
            }
        });

    },


    // Clear the arrangement
    clearArrangement: () => dispatch => {
        dispatch({
            type: battleshipConstants.CLEAR_SHIP
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
                    notifierActions.showError("Could not join the game room.");
                } else {
                    console.log('Authorized successfully.')
                }
            });

            // Receive battleship from server
            socket.gameRoom.on('receive_event', (data) => {
                switch (data.name) {
                    case MessageEvent.UPDATE_GAME_STATE: dispatch(battleshipActions.updateGameState(data)); break;
                    default:
                }
            });

            dispatch(battleshipActions.login(roomId));
        }
    },


    updateGameState: (gameState) => dispatch => {
        dispatch({
            type: battleshipConstants.UPDATE_GAME_STATE,
            payload: gameState
        });
    },


    // Give a shot
    fire: (x, y) => {
        return (dispatch, getState, socket) => {
            
            socket.gameRoom.emit('request_command', {
                "name": "shoot",
                "x": x,
                "y": y
            }) 
            
        }
    },


}