
import {ShipSize} from './constants'

const Utilities = {
    // Convert from ship length to ship size
    shipLength2Size: (length) => {
        if (length ===  1) return ShipSize.SMALL
        else if (length ===  2) return ShipSize.MID
        else if (length ===  3) return ShipSize.LARGE
        return ShipSize.GIANT
    },

    // Convert from ship size to ship length
    shipSize2Length: (size) => {
        if (size === ShipSize.SMALL) return 1
        else if (size === ShipSize.MID) return 2
        else if (size === ShipSize.LARGE) return 3
        else if (size === ShipSize.GIANT) return 4
        return -1
    },

    // Count ship of player in the board
    // This function is use in ship arrangment to ensure that we only put enough ships on the board
    countShip:(ships, size) => {
        let count = 0;
        for (let i = 0; i < ships.length; ++i) {
            if (ships[i].size ===  size) {
                ++count;
            }
        }
        return count;
    },

    // Create a binary board same size as the battle field.
    // True: have a ship here, False: empty
    createCoverageBoard: (width, height, ships) => {
        let board = []
        for (let i = 0; i < width; ++i) {
            let row = [];
            for (let j = 0; j < height; ++j) row.push(false);
            board.push(row);
        }

        for (let i = 0; i < ships.length; ++i) {
            let ship = ships[i];
            let length = Utilities.shipSize2Length(ship.size);
            for (let i = 0; i < length; ++i) {
                if (ship.vertical) {
                    board[ship.x][ship.y + i] = true;
                } else {
                    board[ship.x + i][ship.y] = true;
                }
            }
        }

        return board;
    },

    // Board collision
    // Return true if 2 coverage board have common point with value true
    checkCoverageBoardCollision: (board1, board2) => {

        let board1Height = board1.length;
        let board1Width = board1[0].length;
        let board2Height = board2.length;
        let board2Width = board2[0].length;

        // Common area
        let cols = Math.min(board1Width, board2Width);
        let rows = Math.min(board1Height, board2Height);

        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < cols; ++j) {
                if (board1[i][j] === true  && board2[i][j] === true) {
                    return true;
                }
            }   
        }

        return false;
    },


    // Check ship collision.
    // Use this to check if we can put a new ship in a board with other ships
    // Return false if we can put the new ship into board
    checkShipCollision: (boardWidth, boardheight, ships, newShip) => {

        let coverageBoard = Utilities.createCoverageBoard(boardWidth, boardheight, ships);
        let newShipCoverageBoard = Utilities.createCoverageBoard(boardWidth, boardheight, [newShip]);

        return Utilities.checkCoverageBoardCollision(coverageBoard, newShipCoverageBoard)
    }

}

export default Utilities
