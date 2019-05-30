import request, {
    requestStatus
} from '../../utilities/http'
import battleshipConstants, {MessageEvent, BoardState} from './constants'

import {
    notifierActions
} from '../notifier/actions'


import {getInitState} from './reducers'


import Utilities from './utilities'

export const battleshipActions = {

    login: (roomId) => (dispatch, getState, socket) =>  {
        // Login
        socket.gameRoom.emit('request_login', {
            'authorization': getState().userReducer.token,
            'room_public_id': roomId
        })

        // Request to get game data after login
        setTimeout(() => {
            socket.gameRoom.emit('request_command', {"command": {
                "name": "request_update"
            }})
        }, 500)
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
        if ((shipVertical && y + shipLength > boardheight) || (!shipVertical && x + shipLength > boardWidth)) {
            notifierActions.showError("Wrong ship position. Please choose another position.");
            return;
        }

        // Check ship collision
        let newShip = {
            x: x,
            y: y,
            vertical: shipVertical,
            size: selectedShipSize
        };

        
        if (Utilities.checkShipCollision(boardWidth, boardheight, ships, newShip)) {
            notifierActions.showError("We cannot put other ship here.");
            return;
        }

        // Add ship to the board
        dispatch({
            type: battleshipConstants.ADD_SHIP,
            payload: newShip
        });

    },


    // Clear the arrangement
    clearArrangement: () => dispatch => {
        dispatch({
            type: battleshipConstants.CLEAR_SHIP
        });
    },

    // Submit arrangement
    submitShips: () => (dispatch, getState, socket) =>  {
        let ships = getState().battleshipReducer.gameState.player1.ships;
        let shipsForServer = [];

        for (let i = 0; i < ships.length; ++i) {
            shipsForServer.push({
                "x": ships[i].x,
                "y": ships[i].y,
                "vertical": ships[i].vertical,
                "len_ship": Utilities.shipSize2Length(ships[i].size)
            });
        }

        socket.gameRoom.emit('request_command', {"command": {
            "name": "save_ships",
            "ships": shipsForServer
        }})

        setTimeout(() => {
            socket.gameRoom.emit('request_command', {"command": {
                "name": "request_update"
            }})
        }, 500)

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
            socket.gameRoom.removeListener('response_command');
            socket.gameRoom.removeListener('receive_event');

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
                console.log(data)
                switch (data.name) {
                    case MessageEvent.UPDATE_GAME_STATE: dispatch(battleshipActions.updateGameState(data)); break;
                    default:
                }
            });

            // Receive command response
            socket.gameRoom.on('response_command', (data) => {
                console.log(data)
            });

            dispatch(battleshipActions.login(roomId));
        }
    },


    requestUpdateGameState: () => (dispatch, getState, socket) => {
        setTimeout(() => {
            socket.gameRoom.emit('request_command', {"command": {
                "name": "request_update"
            }})
        }, 500)
    } ,

    // Update game state
    updateGameState: (data) => (dispatch, getState) => {

        let currentState = getState().battleshipReducer;

        // ========== Parse data from server response ==========
        let myId = data.my_public_id;
        let boards = data.boards;
        let amIPlayer = data.is_player;
        let player1 = getInitState().gameState.player1;
        let player2 = getInitState().gameState.player2;
        let players = data.room_data.players;
        let turn = {};
        for (let i = 0; i < boards.length; ++i) {
            let board = boards[i];
            let userId = board.user_public_id;
            let playerInfo = {};
            for (let j = 0; j < players.length; ++j) {
                if (players[j].public_id === userId) {
                    playerInfo = players[j];
                    break;
                }
            }

            let ships = [];
            for (let i = 0; i < board.ships.length; ++i) {
                ships.push({
                    x: board.ships[i].x,
                    y: board.ships[i].y,
                    vertical: board.ships[i].vertical,
                    sink: board.ships[i].sink,
                    size: Utilities.shipLength2Size(board.ships[i].len_ship),
                });
            }


            // If I am a player, I am the player1, otherwise player with i = 0 will be assigned as player1
            let isPlayer1 = board.user_public_id === myId || (!amIPlayer && i === 0);
            if ( isPlayer1 ) {

                // Only update ships of player 1 when the shipsReady changed from false to true.
                // This prevent the board from reseting when player 2 finishes the arrangement before player 1
                let updatedArrangement = board.ships_ready && !currentState.gameState.player1.shipsReady;
                player1 = {
                    fullname: playerInfo.username,
                    playerPublicId: playerInfo.public_id, 
                    data: board.board,
                    ships: updatedArrangement ? ships : currentState.gameState.player1.ships,
                    shipsReady: board.ships_ready
                };
                
            } else {
                player2 = {
                    fullname: playerInfo.username,
                    playerPublicId: playerInfo.public_id, 
                    data: board.board,
                    ships: ships,
                    shipsReady: board.ships_ready
                };
            }
        }

        // The player playing this turn
        for (let j = 0; j < players.length; ++j) {
            if (players[j].public_id === data.turn) {
                turn = {
                    fullname: players[j].username,
                    playerPublicId: players[j].public_id,
                }
            }
        }


        let newState = {...currentState, 
            myPublicId: myId,
            gameState: {
                ...currentState.gameState,
                isInitialState: false,
                gameOver: data.game_over,
                winnerId: data.winner,
                isEnoughPlayer: data.is_enough_player,
                isMyRoom: data.is_player,
                gameName: data.room_data.game.name,
                roomId: data.room_data.room_public_id,
                isMyTurn: data.turn === myId,
                turn: turn,
                player1: player1,
                player2: player2
            }
        }

        dispatch({
            type: battleshipConstants.UPDATE_GAME_STATE,
            payload: newState
        });


        // Play win or lose sound
        if (newState.gameState.gameOver && !currentState.gameState.gameOver) {

            // I am the loser
            if (newState.gameState.isMyRoom && currentState.gameState.isMyRoom && newState.myPublicId !== newState.gameState.winnerId) {
                dispatch({
                    type: 'PLAY_SOUND',
                    meta: {
                        sound: {
                            play :'lose'
                        }
                    }
                })
            } else { // Winner or not my game
                dispatch({
                    type: 'PLAY_SOUND',
                    meta: {
                        sound: {
                            play :'win'
                        }
                    }
                })
            }
        }

        // Sound for shots
        if (!currentState.gameState.isInitialState) {

            // Player 1
            let player1Board = currentState.gameState.player1.data;
            let newPlayer1Board = newState.gameState.player1.data;
            dispatch(battleshipActions.playShotSound(player1Board, newPlayer1Board));

            // Player 2
            let player2Board = currentState.gameState.player2.data;
            let newPlayer2Board = newState.gameState.player2.data;
            dispatch(battleshipActions.playShotSound(player2Board, newPlayer2Board));

        }
        
        // New game started
        if (newState.gameState.player1.shipsReady && newState.gameState.player2.shipsReady && (!currentState.gameState.player1.shipsReady || !currentState.gameState.player2.shipsReady)) {
            dispatch({
                type: 'PLAY_SOUND',
                meta: {
                    sound: {
                        play :'gameStarted'
                    }
                }
            })
        }

        
    },



    playShotSound: (oldBoard, newBoard)  => (dispatch, getState) => {

        let rows = getState().battleshipReducer.gameState.boardHeight;
        let cols = getState().battleshipReducer.gameState.boardWidth;

        for (let y = 0; y < rows; ++y ) {
            for (let x = 0; x < cols; ++x) {
                try {

                    if (oldBoard[y][x] === BoardState.HIDDEN && newBoard[y][x] < BoardState.HIDDEN) { // miss
                        dispatch({
                            type: 'PLAY_SOUND',
                            meta: {
                                sound: {
                                    play :'fire'
                                }
                            }
                        })
                    } else if (oldBoard[y][x] === BoardState.HIDDEN && newBoard[y][x] > BoardState.HIDDEN) { // hit
                        dispatch({
                            type: 'PLAY_SOUND',
                            meta: {
                                sound: {
                                    play :'wounded'
                                }
                            }
                        })
                    }

                } catch(e) {
                    console.log(e);
                }
            }
        }

    },


    // Give a shot
    fire: (x, y) => {
        return (dispatch, getState, socket) => {

            // Fire if the cell is hidden
            // if (data[y][x] == BoardState.HIDDEN) {
                socket.gameRoom.emit('request_command', {"command": {
                    "name": "shoot",
                    "x": x,
                    "y": y
                }})

                setTimeout(() => {
                    socket.gameRoom.emit('request_command', {"command": {
                        "name": "request_update"
                    }})
                }, 500)
                

                dispatch({
                    type: 'PLAY_SOUND',
                    meta: {
                        sound: {
                            play :'fire'
                        }
                    }
                })
            // }
            
            console.log({"command": {
                "name": "shoot",
                "x": x,
                "y": y
            }});
            
        }
    },


}