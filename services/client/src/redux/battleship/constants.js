const battleshipConstants = {
    CLEAR_BATTLESHIPS: 'CLEAR_BATTLESHIPS',
    FETCH_BATTLESHIPS_SUCCESS: 'FETCH_BATTLESHIPS_SUCCESS',
    PUSH_NEW_BATTLESHIP: 'PUSH_NEW_BATTLESHIP',
    SET_OPPONENT: 'SET_OPPONENT',

    SELECT_SHIP_SIZE: 'SELECT_SHIP_SIZE',
    TOGGLE_SHIP_ROTATE: 'TOGGLE_SHIP_ROTATE',

    RESET_GAME: 'RESET_GAME'
};


export const ShipSize  =  {
    GIGANT    : 4,
    LARGE     : 3,
    MID       : 2,
    SMALL     : 1
}


export const GameState = {
    LOADING: 'LOADING',
    ARRANGING: 'ARRANGING',
    PLAYING: 'PLAYING',
    FINSIHED: 'FINISHED'
}

export default battleshipConstants;