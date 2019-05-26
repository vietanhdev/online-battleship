const battleshipConstants = {
    CLEAR_BATTLESHIPS: 'CLEAR_BATTLESHIPS',
    FETCH_BATTLESHIPS_SUCCESS: 'FETCH_BATTLESHIPS_SUCCESS',
    PUSH_NEW_BATTLESHIP: 'PUSH_NEW_BATTLESHIP',
    SET_OPPONENT: 'SET_OPPONENT',

    SELECT_SHIP_SIZE: 'SELECT_SHIP_SIZE',
    TOGGLE_SHIP_ROTATE: 'TOGGLE_SHIP_ROTATE',
    ADD_SHIP: 'ADD_SHIP',
    CLEAR_SHIP: 'CLEAR_SHIP',

    UPDATE_GAME_STATE: 'UPDATE_GAME_STATE'
};


export const ShipSize  =  {
    GIANT    : 'GIANT',
    LARGE     : 'LARGE',
    MID       : 'MID',
    SMALL     : 'SMALL'
}


export const BoardState = {
    MISS: -1,
    HIDDEN: 0,
    HIT: 1,
    DESTROYED: 2
}


export const MessageEvent = {
    UPDATE_GAME_STATE: "update_boards"
}

export default battleshipConstants;