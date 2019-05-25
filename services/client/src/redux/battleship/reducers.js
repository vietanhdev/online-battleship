import battleshipConstants, {ShipSize, GameState} from './constants'

const initState = {
    opponent: {},
    shipArrangement: {
        rotateShip: false,
        selectedShipSize: ShipSize.GIGANT
    },
    gameState: GameState.LOADING
}

export const battleshipReducer = (state = initState, action) =>  {
    switch (action.type) {
        case battleshipConstants.RESET_GAME:
            return Object.assign({}, initState);
        case battleshipConstants.SELECT_SHIP_SIZE:
            return {...state, shipArrangement:{...state.shipArrangement, selectedShipSize: action.payload} }
        case battleshipConstants.TOGGLE_SHIP_ROTATE:
            return {...state, shipArrangement:{...state.shipArrangement, rotateShip: !state.shipArrangement.rotateShip} }
        default:
            return state
    }
}