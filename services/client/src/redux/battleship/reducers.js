import battleshipConstants, {ShipSize} from './constants'

const initState = {
    opponent: {},
    shipArrangement: {
        rotateShip: false,
        selectedShipSize: ShipSize.GIGANT
    }
}

export const battleshipReducer = (state = initState, action) =>  {
    switch (action.type) {
        case battleshipConstants.SELECT_SHIP_SIZE:
            return {...state, shipArrangement:{...state.shipArrangement, selectedShipSize: action.payload} }
        case battleshipConstants.TOGGLE_SHIP_ROTATE:
            return {...state, shipArrangement:{...state.shipArrangement, rotateShip: !state.shipArrangement.rotateShip} }
        default:
            return state
    }
}