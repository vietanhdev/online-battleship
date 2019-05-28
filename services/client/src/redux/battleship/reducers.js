import battleshipConstants, {ShipSize} from './constants'
import Utilities from './utilities';


const getInitState = () => {
    let rowInit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let boardInitState = [rowInit, rowInit, rowInit, rowInit, rowInit, rowInit, rowInit, rowInit, rowInit, rowInit]
    const initState = {
        myPublicId: "",
        shipArrangement: {
            vertical: true,
            selectedShipSize: ShipSize.GIANT
        },
        gameState: {
            gameOver: false,
            winnerId: "",
            boardWidth: 10,
            boardHeight: 10,
            maxNumberOfShips: {
                "GIANT": 1,
                "LARGE": 2,
                "MID": 3,
                "SMALL": 4
            },
            isEnoughPlayer: false,
            isMyRoom: false,
            gameName: "BattleShip",
            roomId: "",
            isMyTurn: false,
            turn: {
                fullname: "",
                playerPublicId: ""
            },
            player1: {
                fullname: "",
                playerPublicId: "", 
                data: boardInitState,
                ships: [],
                shipsReady: false
            },
            player2: {
                fullname: "",
                playerPublicId: "", 
                data: boardInitState,
                ships: [],
                shipsReady: false
            }
        }
    }
    
    return initState;
}

export const battleshipReducer = (state = getInitState(), action) =>  {
    let newState = {};
    switch (action.type) {
        case battleshipConstants.SELECT_SHIP_SIZE:
            return {...state, shipArrangement:{...state.shipArrangement, selectedShipSize: action.payload} }
        case battleshipConstants.TOGGLE_SHIP_ROTATE:
            return {...state, shipArrangement:{...state.shipArrangement, vertical: !state.shipArrangement.vertical} }
        case battleshipConstants.ADD_SHIP:
            return {
                ...state,
                gameState: {
                    ...state.gameState,
                    player1: {
                        ...state.gameState.player1,
                            ships: [...state.gameState.player1.ships, {
                                x: action.payload.x,
                                y: action.payload.y,
                                vertical: action.payload.vertical,
                                sink: false,
                                size: action.payload.size
                            }]
                    }
                }
            }
        case battleshipConstants.CLEAR_SHIP:
            return {
                ...state,
                gameState: {
                    ...state.gameState,
                    player1: {
                        ...state.gameState.player1,
                        ships: []
                    }
                }
            }
        case battleshipConstants.UPDATE_GAME_STATE:

            // ========== Parse data from server response ==========
            let myId = action.payload.my_public_id;
            let boards = action.payload.boards;
            let player1 = getInitState().gameState.player1;
            let player2 = getInitState().gameState.player2;
            let players = action.payload.room_data.players;
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

                if (board.user_public_id === myId || (board.user_public_id !== myId && i == 0)) {

                    // Only update ships of player 1 when the shipsReady changed from false to true.
                    // This prevent the board from reseting when player 2 finishes the arrangement before player 1
                    let updatedArrangement = board.ships_ready && !state.gameState.player1.shipsReady;
                    player1 = {
                        fullname: playerInfo.username,
                        playerPublicId: playerInfo.public_id, 
                        data: board.board,
                        ships: updatedArrangement ? ships : state.gameState.player1.ships,
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
                if (players[j].public_id === action.payload.turn) {
                    turn = {
                        fullname: players[j].username,
                        playerPublicId: players[j].public_id,
                    }
                }
            }


            newState = {...state, 
                myPublicId: myId,
                gameState: {
                    ...state.gameState,
                    gameOver: action.payload.game_over,
                    winnerId: action.payload.winner,
                    isEnoughPlayer: action.payload.is_enough_player,
                    isMyRoom: action.payload.is_player,
                    gameName: action.payload.room_data.game.name,
                    roomId: action.payload.room_data.room_public_id,
                    isMyTurn: action.payload.turn === myId,
                    turn: turn,
                    player1: player1,
                    player2: player2
                }
            }

            console.log(newState)

            return newState
        default:
            return state
    }
}