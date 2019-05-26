var localMessages = {
    "appButtonDesc": {
    "message": "Battleship Game"
    },
    "appDesc": {
    "message": "Battleship is now on your computer. Try to find all the ships of the opponent!"
    },
    "appLabelChangePosition": {
    "message": "Change arrangement"
    },
    "appLabelChat": {
    "message": "Battle message"
    },
    "appLabelConfirmStageWait": {
    "message": "Waiting for battle"
    },
    "appLabelDifficultEasy": {
    "message": "Easy"
    },
    "appLabelDifficultExpert": {
    "message": "Expert"
    },
    "appLabelDifficultNormal": {
    "message": "Normal"
    },
    "appLabelFleetStatus": {
    "message": "Fleet status"
    },
    "appLabelLose": {
    "message": "Lose"
    },
    "appLabelMyFleet": {
    "message": "My fleet"
    },
    "appLabelNewGame": {
    "message": "New game"
    },
    "appLabelOpponentFleet": {
    "message": "Opponent's fleet"
    },
    "appLabelOpponentMove": {
    "message": "Opponent move"
    },
    "appLabelOpponentMoveMsg": {
    "message": "Opponent's move:"
    },
    "appLabelPrepareStagePosition": {
    "message": "Place your fleet on the field"
    },
    "appLabelRUReady": {
    "message": "You are completely ready to sea battle! Starting, Captain?"
    },
    "appLabelRUReadyOR": {
    "message": "Or do you want to change arrangement of ships?"
    },
    "appLabelReallyNewGame": {
    "message": "Do you really want to start a new game?"
    },
    "appLabelReallyNewGameNo": {
    "message": "No"
    },
    "appLabelReallyNewGameYes": {
    "message": "Yes"
    },
    "appLabelRndArrangement": {
    "message": "Random arrangement"
    },
    "appLabelToBattle": {
    "message": "TO BATTLE"
    },
    "appLabelWin": {
    "message": "Win!!!"
    },
    "appLabelYourMoveFire": {
    "message": "Your move, fire!"
    },
    "appLabelYourMoveMsg": {
    "message": "Your move:"
    },
    "appName": {
    "message": "BattleShip Game"
    }
}
 


let getLocalsMessage = (messagename) => { return localMessages[messagename]['message'] }

function GUILocalization(){
    document.querySelector("#newGame").textContent = getLocalsMessage("appLabelNewGame");
    document.querySelectorAll('.game_field-title')[0].textContent = getLocalsMessage("appLabelMyFleet");
    document.querySelectorAll('.game_field-title')[1].textContent = getLocalsMessage("appLabelOpponentFleet");
    document.querySelector(".header-title").textContent = getLocalsMessage("appLabelPrepareStagePosition");
    document.querySelector("#auto").textContent = getLocalsMessage("appLabelRndArrangement");
    document.querySelectorAll(".footer-title")[0].textContent = getLocalsMessage("appLabelFleetStatus");
    document.querySelectorAll(".footer-title")[1].textContent = getLocalsMessage("appLabelChat");
    document.querySelector("#start").textContent = getLocalsMessage("appLabelToBattle");
    document.querySelector(".prepare_overlay-text").textContent = getLocalsMessage("appLabelRUReady");
    document.querySelector(".prepare_overlay-text--small").textContent = getLocalsMessage("appLabelRUReadyOR");
    document.querySelector(".overlay-text").textContent = getLocalsMessage("appLabelReallyNewGame");
    document.querySelector(".overlay-btn--yes").textContent = getLocalsMessage("appLabelReallyNewGameYes");
    document.querySelector(".overlay-btn--no").textContent = getLocalsMessage("appLabelReallyNewGameNo");
    document.querySelectorAll("option")[0].textContent = getLocalsMessage("appLabelDifficultEasy");
    document.querySelectorAll("option")[1].textContent = getLocalsMessage("appLabelDifficultNormal");
    document.querySelectorAll("option")[2].textContent = getLocalsMessage("appLabelDifficultExpert");
}
let Storage = {
    setValue : (key, value) => { localStorage[key] = JSON.stringify(value); },
    getValue : (key) => {
        let result = undefined;
        try {
            if (localStorage[key]) result = JSON.parse(localStorage[key]);
        } catch (e) {
            throw new StorageError(`Error in localStorage[${key}] value. ${localStorage[key]}`);
        }
        return result; 
    }
};

/**
 * StorageError
 * @param   string      _msg    Error message    
 */
class StorageError extends Error {
    constructor(_msg){
        super();
        this.name = 'StorageError';
        this.message = _msg || 'Storage Error';
        this.stack = (new Error()).stack;
    }
}

const GAME_STATE = Object.freeze({
    'WIN'       : 1,
    'LOSE'      : 2,
    'CONTINUE'  : 3
});

const GAME_SCREEN = Object.freeze({
    'PREPARE' : 0,
    'CONFIRM' : 1,
    'BATTLE'  : 2
});

const SHIP_STATE = Object.freeze({
    'NORMAL'    : 0,
    'FAILED'    : 1,
    'DESTROYED' : 2
});

const DIFFICULT_LEVEL = Object.freeze({
    'EASY'    : 0,
    'NORMAL'  : 1,
    'HARD'    : 2
});

const POINT_STATE = Object.freeze({
    'CLEAN'     : 0,
    'MISS'      : 1,
    'AUTO'      : 2,
    'SHIP'      : 3,
    'ENV'       : 4,
    'DAMAGED'   : 5,
    'KILLED'    : 6
});

const DIRECTION = Object.freeze({
    'RIGHT'    : Object.freeze({dx: +1, dy:  0}),
    'DOWN'     : Object.freeze({dx:  0, dy: +1}),
    'LEFT'     : Object.freeze({dx: -1, dy:  0}),
    'UP'       : Object.freeze({dx:  0, dy: -1}),
    'NONE'     : Object.freeze({dx:  0, dy:  0}),
    'RD'       : Object.freeze({dx: +1, dy: -1}),
    'RU'       : Object.freeze({dx: +1, dy: +1}),
    'LU'       : Object.freeze({dx: -1, dy: -1}),
    'LD'       : Object.freeze({dx: -1, dy: +1})
});

const SHIP_TYPE = Object.freeze({
    'GIANT'    : Object.freeze({ len: 4, directions: [DIRECTION.RIGHT, DIRECTION.DOWN]}),
    'LARGE'     : Object.freeze({ len: 3, directions: [DIRECTION.RIGHT, DIRECTION.DOWN]}),
    'MID'       : Object.freeze({ len: 2, directions: [DIRECTION.RIGHT, DIRECTION.DOWN]}),
    'SMALL'     : Object.freeze({ len: 1, directions: [DIRECTION.NONE]}),
});

const NAV_HORIZONTAL = ['1','2','3','4','5','6','7','8','9','10'];
const NAV_VERTICAL = ['A','B','C','D','E','F','J','H','I','J'];


const AI_TURN_DELAY = 1 * 1000;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function indexOfPointInArray(arr, pt) {
    let idx = -1;
    for (let i = 0; i < arr.length && idx === -1; i++) {
        if (arr[i].x === pt.x && arr[i].y === pt.y) {
            idx = i;
        }
    }
    return idx;
}

function intersectPointArray(arr1, arr2){
    let idx = -1;
    let arr3 = [];
    for (let i = 0; i < arr2.length; i++) {
       idx = indexOfPointInArray(arr1, arr2[i]);
       if (idx >= 0) arr3.push(arr2[i]);
    }
    return arr3;
}


class Battlefield {
    constructor(autoPlaceholder = false, width = 10, height = 10) {
        this.width = width;
        this.height = height;
        this.matrix = [];
        this.autoPlaceholders = autoPlaceholder;
        this.reset();
    }
    getMatrix() { return this.matrix; }
    reset() {
        for (let i = 0; i < this.height; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.matrix[i][j] = { value: POINT_STATE.CLEAN, owner: null }; // owner is SHIP instance
            }
        }
    }
    attack(x, y) {
        let value = this.matrix[x][y].value;
        let hit = false;
        let available = true;
        switch(this.matrix[x][y].value) {
            case POINT_STATE.CLEAN:
                value = POINT_STATE.MISS;
                break;
            case POINT_STATE.MISS:
                available = false;
                break;
            case POINT_STATE.AUTO:
                value = POINT_STATE.MISS;
                break;
            case POINT_STATE.SHIP:
                hit = true;
                let hitValue = this.matrix[x][y].owner.wasAttacked(x, y, 1);
                if (hitValue === POINT_STATE.DAMAGED) {
                    value = POINT_STATE.DAMAGED;
                } else if (hitValue === POINT_STATE.KILLED) {
                    value = POINT_STATE.KILLED;
                    this.matrix[x][y].owner.wasKilled(this.matrix, this.autoPlaceholders);
                } else {
                    value = hitValue;
                }
                break;
            case POINT_STATE.ENV:
                value = POINT_STATE.MISS;
                break;
            case POINT_STATE.DAMAGED:
                available = false;
                break;
            case POINT_STATE.KILLED:
                available = false;
                break;
            default: 
                break; 
        }
        this.matrix[x][y].value = value;
        return { hit: hit, available: available, value: value};
    }
    getPossibleTurns() {
        let pts = [];
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix.length; j++) {
                if ((this.matrix[i][j].value !== POINT_STATE.KILLED) &&
                    (this.matrix[i][j].value !== POINT_STATE.DAMAGED) &&
                    (this.matrix[i][j].value !== POINT_STATE.MISS) &&
                    (this.matrix[i][j].value !== POINT_STATE.AUTO || !this.autoPlaceholders)) {
                    pts.push({x: i, y: j});
                }
            }
        }
        return pts;
    }
    draw(isHidden = false, preview = false, cellMark = 'c') {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let cell = document.querySelector(`#${cellMark}${i}_${j}`);
                let v = "";
                switch(this.matrix[i][j].value) {
                    case POINT_STATE.CLEAN:
                        v = isHidden ? "" : "";
                        break;
                    case POINT_STATE.MISS:
                        v = "shot-miss";
                        break;
                    case POINT_STATE.AUTO:
                        v = "shot-mark";
                        break;
                    case POINT_STATE.SHIP:
                        // TODO: draw ship if not hidden
                        if (isHidden) {
                            v = "";
                        } else {
                            v =  (this.matrix[i][j].owner.type === SHIP_TYPE.GIANT ? "ship-4" : ((this.matrix[i][j].owner.type === SHIP_TYPE.LARGE ? "ship-3" : ((this.matrix[i][j].owner.type === SHIP_TYPE.MID ? "ship-2" : "ship-1")))));
                        }
                        break;
                    case POINT_STATE.ENV:
                        v = isHidden ? "" : (preview ? "shot-mark" : "");
                        break;
                    case POINT_STATE.DAMAGED:
                        v = "shot-hit";
                        break;
                    case POINT_STATE.KILLED:
                        // TODO: draw killed ship
                        v = "shot-hit";
                        if (this.matrix[i][j].owner.x === i && this.matrix[i][j].owner.y === j) {
                            v += " " + (this.matrix[i][j].owner.type === SHIP_TYPE.GIANT ? "ship-4" : ((this.matrix[i][j].owner.type === SHIP_TYPE.LARGE ? "ship-3" : ((this.matrix[i][j].owner.type === SHIP_TYPE.MID ? "ship-2" : "ship-1"))))) + (((this.matrix[i][j].owner.direction === DIRECTION.RIGHT) || (this.matrix[i][j].owner.direction === DIRECTION.UP)) ? "" : " ship-ver");  
                        }
                        break;
                    default:
                        v = "";
                }
                if (this.matrix[i][j].value === POINT_STATE.SHIP && !isHidden) {
                    let direction = ((this.matrix[i][j].owner.direction === DIRECTION.RIGHT) || (this.matrix[i][j].owner.direction === DIRECTION.UP)) ? "" : " ship-ver";
                    document.querySelector(`#${cellMark}${this.matrix[i][j].owner.x}_${this.matrix[i][j].owner.y}`).className += (v !== "" ? " " + v : "") + direction;
                } else {
                    cell.className = "game_grid-cell" + (v !== "" ? " " + v : "");
                }   
            }
        }
    }
    update(envmark = POINT_STATE.ENV) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.matrix[i][j].owner !== null) {
                    this.matrix[i][j].owner.markEnv(this.matrix, envmark);
                }
            }
        }
    }
}

class Ship {
    constructor(headX, headY, direction, type) {
        this.len = type.len;
        this.x = headX;
        this.y = headY;
        this.direction = direction;
        this.state = 0;
        this.type = type;
        this.hp = type.len;
    }
    getShipCoordinates() {
        let coordinates = [];
        for (let t = 0; t < this.len; t++) {
            coordinates.push({x: this.x + this.direction.dy * t, y: this.y + this.direction.dx * t});
        }
        return coordinates;
    }
    wasAttacked(x, y, dmg) {
        this.hp -= dmg;
        if (this.hp === 0)
            return POINT_STATE.KILLED;
        return POINT_STATE.DAMAGED;
    }
    wasKilled(matrix, isAutoPlaceholders = false) {
        if (isAutoPlaceholders) {
            for (let t = 0; t < this.len; t++) {
                this.markShipEnv(matrix, this.x + this.direction.dy * t, this.y + this.direction.dx * t, POINT_STATE.AUTO);
            }
        }
        for (let t = 0; t < this.len; t++) {
            matrix[this.x + this.direction.dy * t][this.y + this.direction.dx * t].value = POINT_STATE.KILLED;
        }
    }
    place(matrix, envmark = POINT_STATE.ENV) {
        if (this.check(matrix)) {
            this.markEnv(matrix, envmark);
            return true;
        }
        return false;
    }
    markEnv(matrix, envmark = POINT_STATE.ENV) {
        for (let t = 0; t < this.len; t++) {
            this.markShipEnv(matrix, this.x + this.direction.dy * t, this.y + this.direction.dx * t, envmark);
        }
        for (let t = 0; t < this.len; t++) {
            matrix[this.x + this.direction.dy * t][this.y + this.direction.dx * t].value = POINT_STATE.SHIP;
            matrix[this.x + this.direction.dy * t][this.y + this.direction.dx * t].owner = this;
        }
    }
    markShipEnv(matrix, x, y, envmark = POINT_STATE.ENV) {
        let arr = [
            DIRECTION.LU, DIRECTION.UP, DIRECTION.RU,
            DIRECTION.LEFT, DIRECTION.RIGHT,
            DIRECTION.LD, DIRECTION.DOWN, DIRECTION.RD
        ];
        for (let l = 0; l < arr.length; l++) {
            if ((x + arr[l].dy < matrix.length) && 
                (y + arr[l].dx < matrix.length) &&
                (x + arr[l].dy >= 0) && 
                (y + arr[l].dx >= 0)) {
                matrix[x + arr[l].dy][y + arr[l].dx].value = envmark;
            }
        }
    }
    check(matrix) {
        let available = true;
        for (let t = 0; t < this.len && available; t++) {
            if ((this.x + this.direction.dy * t < matrix.length) && 
                (this.y + this.direction.dx * t < matrix.length) &&
                (this.x + this.direction.dy * t >= 0) && 
                (this.y + this.direction.dx * t >= 0)) {
                if (matrix[this.x + this.direction.dy * t][this.y + this.direction.dx * t].value !== POINT_STATE.CLEAN) {
                    available = false;
                }
            } else {
                available = false;
            }
        }
        return available;
    }
    turn(matrix) {
        let curr_idx = 0, next_idx = 0;
        for (let k = 0; k < this.type.directions.length; k++) {
            if ((this.type.directions[k].dx === this.direction.dx) && (this.type.directions[k].dy === this.direction.dy)) {
                curr_idx = k;
            }
        }
        next_idx = curr_idx + 1;
        if (curr_idx === this.type.directions.length - 1) {
            next_idx = 0;
        }
        this.erase(matrix);
        let oldDirection = this.direction;
        this.direction = this.type.directions[next_idx];
        let available = this.check(matrix);
        if (!available) {
            this.direction = oldDirection;
        }
        this.place(matrix);
        return available;
    }
    move(matrix, newX, newY) {
        let oldX = this.x;
        let oldY = this.y;
        this.erase(matrix);
        this.x = newX;
        this.y = newY;
        let available = this.check(matrix);
        if (!available) {
            this.x = oldX;
            this.y = oldY;
        }
        this.place(matrix);
        return available;
    }
    erase(matrix) {
        let shcoords = this.getShipCoordinates();
        for (let i = 0; i < shcoords.length; i++) {
            this.markShipEnv(matrix, shcoords[i].x, shcoords[i].y, POINT_STATE.CLEAN);
            matrix[shcoords[i].x][shcoords[i].y].value = POINT_STATE.CLEAN;
            matrix[shcoords[i].x][shcoords[i].y].owner = null;
        }
    }
}

/**
 * @param   object  ship    {directions: [<DIRECTION>], len: (int)}
 */
function getPossibleShipPositions(matrix, width, height, ship) {
    let positions = [];     // { x:(int), y:(int), d:(DIRECTION)}
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            for (let k = 0; k < ship.directions.length; k++) {
                let available = true;
                for (let t = 0; t < ship.len && available; t++) {
                    if ((i + ship.directions[k].dy * t < height) && 
                        (j + ship.directions[k].dx * t < width) &&
                        (i + ship.directions[k].dy * t >= 0) && 
                        (j + ship.directions[k].dx * t >= 0)) {
                        if (matrix[i + ship.directions[k].dy * t][j + ship.directions[k].dx * t].value !== POINT_STATE.CLEAN) {
                            available = false;
                        }
                    } else {
                        available = false;
                    }
                }
                if (available) {
                    positions.push({x: i, y: j, d: ship.directions[k]});
                }
            }
        }
    }
    return positions;
}

function placeAllShipsAuto(matrix, ships = [SHIP_TYPE.GIANT, SHIP_TYPE.LARGE, SHIP_TYPE.LARGE, SHIP_TYPE.MID, SHIP_TYPE.MID, SHIP_TYPE.MID, SHIP_TYPE.SMALL, SHIP_TYPE.SMALL, SHIP_TYPE.SMALL, SHIP_TYPE.SMALL]){
    let battleShips = [];
    for (let s = 0; s < ships.length; s++) {
        let posiblePositions = getPossibleShipPositions(matrix, 10, 10, ships[s]);
        let idx = getRandomInt(0, posiblePositions.length);
        let battleShip = new Ship(posiblePositions[idx].x, posiblePositions[idx].y, posiblePositions[idx].d, ships[s]);
        if (battleShip.place(matrix)) {
            battleShips.push({ status: SHIP_STATE.NORMAL, ship: battleShip});
        } else {
            battleShips.push({ status: SHIP_STATE.FAILED, ship: battleShip});
        }
    }
    return battleShips;
}

class Player {
    constructor(name, bf) {
        this.name = name;
        this.bf = bf;
        this.possibleTurns = this.bf.getPossibleTurns();
        this.madeTurns = [];
        this.defeatedShips = [0, 0, 0, 0];
    }
    attack(x, y) {
        let hit = false;
        let turn = {x : x, y : y};
        let attack_result = this.bf.attack(turn.x, turn.y);
        let msg = attack_result.value === POINT_STATE.KILLED ? "KILLED" : (attack_result.value === POINT_STATE.DAMAGED ? "DAMAGED" : "MISS");
        this.removeTurn(this.possibleTurns, turn.x, turn.y);
        this.madeTurns.push(turn);
        switch(attack_result.value) {
            case POINT_STATE.KILLED:
                hit = true;
                this.defeatedShips[this.bf.getMatrix()[turn.x][turn.y].owner.type.len - 1]++;
                this.possibleTurns = intersectPointArray(this.possibleTurns, this.bf.getPossibleTurns());
                break;
            case POINT_STATE.DAMAGED:
                hit = true;
                break;
            case POINT_STATE.MISS:
            default:
                break;
        }
        return hit;
    }
    removeTurn(turns, x, y) {
        let idx = indexOfPointInArray(turns, {x: x, y: y});
        if (idx >= 0) 
            turns.splice(idx, 1);
        return turns;
    }
}

class AIPlayer extends Player {
    constructor(name, bf, difficult = DIFFICULT_LEVEL.EASY) {
        super(name, bf);
        this.difficult = difficult;
        this.preferredTurns = [];
        this.turnsGenerator = this.turnsSequence();
    }
    * turnsSequence() {
        while (this.possibleTurns.length > 0) {
            while (this.preferredTurns.length > 0) {
                yield this.preferredTurns[getRandomInt(0, this.preferredTurns.length)];
            }
            if (this.possibleTurns.length > 0) {
                yield this.possibleTurns[getRandomInt(0, this.possibleTurns.length)];
            }
        }
    }
    getPreferredTurns(x, y) {
        let direction = [DIRECTION.RIGHT, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.UP];
        for (let i = 0; i < direction.length; i++) {
            let isPossible = false;
            for (let j = 0; j < this.possibleTurns.length && !isPossible; j++) {
                if ((x + direction[i].dy === this.possibleTurns[j].x) && (y + direction[i].dx === this.possibleTurns[j].y)) {
                    this.preferredTurns.push({x: x + direction[i].dy, y: y + direction[i].dx});
                    isPossible = true;
                }
            }
        }
        let removeTurns = [DIRECTION.RD, DIRECTION.RU, DIRECTION.LU, DIRECTION.LD];
        for (let i = 0; i < removeTurns.length; i++) {
            let isPossible = false;
            for (let j = 0; j < this.possibleTurns.length && !isPossible; j++) {
                if ((x + removeTurns[i].dy === this.possibleTurns[j].x) && (y + removeTurns[i].dx === this.possibleTurns[j].y)) {
                    this.possibleTurns = this.removeTurn(this.possibleTurns, x + removeTurns[i].dy, y + removeTurns[i].dx);
                    isPossible = true;
                }
            }
            let isPreferred = false;
            for (let j = 0; j < this.preferredTurns.length && !isPreferred; j++) {
                if ((x + removeTurns[i].dy === this.preferredTurns[j].x) && (y + removeTurns[i].dx === this.preferredTurns[j].y)) {
                    this.preferredTurns = this.removeTurn(this.preferredTurns, x + removeTurns[i].dy, y + removeTurns[i].dx);
                    isPreferred = true;
                }
            }
        }
        return this.preferredTurns;
    }
    attack() {
        let hit = false;
        let turn = this.turnsGenerator.next().value;
        let attack_result = this.bf.attack(turn.x, turn.y);
        let msg = attack_result.value === POINT_STATE.KILLED ? "KILLED" : (attack_result.value === POINT_STATE.DAMAGED ? "DAMAGED" : "MISS");
        this.removeTurn(this.possibleTurns, turn.x, turn.y);
        this.removeTurn(this.preferredTurns, turn.x, turn.y);
        this.madeTurns.push(turn);
        switch(attack_result.value) {
            case POINT_STATE.KILLED:
                hit = true;
                this.defeatedShips[this.bf.getMatrix()[turn.x][turn.y].owner.type.len - 1]++;
                this.possibleTurns = intersectPointArray(this.possibleTurns, this.bf.getPossibleTurns());
                this.preferredTurns = [];
                break;
            case POINT_STATE.DAMAGED:
                hit = true;
                switch(this.difficult) {
                    case DIFFICULT_LEVEL.NORMAL:
                        this.preferredTurns = this.getPreferredTurns(turn.x, turn.y);
                        break;
                    default:
                        break;
                }
                break;
            case POINT_STATE.MISS:
            default:
                break;
        }
        return hit;
    }
}

function updateUI(screen_state) {
    switch(screen_state) {
        case GAME_SCREEN.PREPARE:
            break;
        case GAME_SCREEN.CONFIRM:
            break;
        case GAME_SCREEN.BATTLE:
            break;
        case GAME_SCREEN.WIN:
            break;
        case GAME_SCREEN.LOSE:
            break;
    }
}

function addChatMessage(isPlayer, turn) {
    let tplayer = isPlayer ? getLocalsMessage("appLabelYourMoveMsg") : getLocalsMessage("appLabelOpponentMoveMsg");
    let tcell = `${NAV_VERTICAL[turn.y]}-${NAV_HORIZONTAL[turn.x]}`;
    let chat = document.querySelector('.chat');
    let pMsg = document.createElement('p');
    pMsg.className = 'chat-message ' + (isPlayer ? 'chat-player' : 'chat-opponent');
    let spId = document.createElement('span');
    spId.className = 'chat-identity';
    spId.textContent = tplayer;
    pMsg.append(spId);
    let spText = document.createElement('span');
    spText.className = 'chat-text';
    spText.textContent = tcell;
    pMsg.append(spText);
    chat.append(pMsg);
}

function clearChat() {
    let chat = document.querySelector('.chat');
    while (chat.firstChild) {
        chat.firstChild.remove();
    }
}

function updateFleetStatus(defeatedShipsPlayerCounter, defeatedShipsAIcounter) {
    for (let i = 0; i < 4; i++) {
        document.querySelectorAll('.fleet-player > .fleet-row > .fleet-counter')[i].textContent = 'x' + ((4 - i) - defeatedShipsPlayerCounter[i]);
        if (((4 - i) - defeatedShipsPlayerCounter[i]) === 0) {
            document.querySelectorAll('.fleet-player > .fleet-row > .fleet-ship')[i].className = 'fleet-ship fleet-ship--destroyed';
        } else {
            document.querySelectorAll('.fleet-player > .fleet-row > .fleet-ship')[i].className = 'fleet-ship';
        }
        for (let j = 0; j < (4 - i); j++) {
            document.querySelectorAll('.fleet-opponent > .fleet-row')[i].querySelectorAll('.fleet-ship')[j].className = 'fleet-ship';
        }
        for (let j = 0; j < defeatedShipsAIcounter[i]; j++) {
            document.querySelectorAll('.fleet-opponent > .fleet-row')[i].querySelectorAll('.fleet-ship')[j].className += ' fleet-ship--destroyed';
        }
    }
}

function checkWinCondition(defeatedShipsPlayerCounter, defeatedShipsAIcounter) {
    let ai_counter = defeatedShipsPlayerCounter[0] + defeatedShipsPlayerCounter[1] + defeatedShipsPlayerCounter[2] + defeatedShipsPlayerCounter[3]; 
    let pl_counter = defeatedShipsAIcounter[0] + defeatedShipsAIcounter[1] + defeatedShipsAIcounter[2] + defeatedShipsAIcounter[3];
    if (ai_counter === 10) {
        SocialModuleInstance && SocialModuleInstance.showSocial();
        return GAME_STATE.LOSE;
    } else if (pl_counter === 10) {
        SocialModuleInstance && SocialModuleInstance.showSocial();
        return GAME_STATE.WIN;
    }
    return GAME_STATE.CONTINUE;
}

document.addEventListener('DOMContentLoaded', () => {
    let screenState = GAME_SCREEN.PREPARE;
    let difficultLevel = DIFFICULT_LEVEL.HARD;
    let battlefield_player = new Battlefield(true);
    let battlefield_ai = null;
    let aipl = null;
    let pl = null;
    let prepare_selected = 0; /* .prepare_cell */
    let prepare_horizontal = true; /* true - horizontal, false - vertical */
    let gameGridCells = document.querySelectorAll('.game_grid-player .game_grid-cell');
    let gameGridCellsAI = document.querySelectorAll('.game_grid-opponent .game_grid-cell');
    let preparedShips = [4, 3, 2, 1];
    let aiShips = [];
    let playerShips = [];
    let isPlayer = false;
    let isFinished = false;

    document.querySelector('select').selectedIndex = difficultLevel;

    //let possibleShipsPosition = [];
    function getSelectedShip(shipId) {
        return (shipId === 0 ? SHIP_TYPE.SMALL : (shipId === 1 ? SHIP_TYPE.MID : (shipId === 2 ? SHIP_TYPE.LARGE : SHIP_TYPE.GIANT)));
    }
    function actionMouseClick(event) {
        //let t = event.target;
        //t.className += (' ship-' + (prepare_selected + 1)) + (!prepare_horizontal ? ' ship-ver' : '');
        let argsId = event.target.id.split('_');
        argsId[0] = ~~argsId[0].replace('c','');
        argsId[1] = ~~argsId[1];
        let targetShip = battlefield_player.getMatrix()[argsId[0]][argsId[1]].owner;
        switch(event.which) {
            case 1:
                // LMC
                if (targetShip === null && preparedShips[prepare_selected] > 0) {
                    let pps = getPossibleShipPositions(battlefield_player.getMatrix(), 10, 10, getSelectedShip(prepare_selected));
                    let isPossible = false;
                    for (let i = 0; i < pps.length && !isPossible; i++) {
                        //{x, y, d}
                        if (pps[i].x === argsId[0] && pps[i].y === argsId[1]) {
                            if (getSelectedShip(prepare_selected) === SHIP_TYPE.SMALL) {
                                isPossible = true;
                            } else {
                                if ((((pps[i].d.dy === 0) && (pps[i].d.dx === 1)) ? DIRECTION.RIGHT: ((pps[i].d.dy === 1) && (pps[i].d.dx === 0)) ? DIRECTION.DOWN: -1) === (prepare_horizontal ? DIRECTION.RIGHT : DIRECTION.DOWN)) {
                                    isPossible = true;
                                }
                            }
                        }
                    }
                    if (isPossible) {
                        targetShip = new Ship(argsId[0], argsId[1], (prepare_horizontal ? DIRECTION.RIGHT : DIRECTION.DOWN), getSelectedShip(prepare_selected));
                        if (targetShip.place(battlefield_player.getMatrix())) {
                            battlefield_player.draw(false, true, 'c');
                            playerShips.push(targetShip);
                            preparedShips[prepare_selected]--;
                            if (preparedShips[prepare_selected] === 0) 
                                (document.querySelectorAll('.prepare_cell')[prepare_selected].className.indexOf("prepare_cell--mute") === -1) && (document.querySelectorAll('.prepare_cell')[prepare_selected].className += " prepare_cell--mute");
                            document.querySelectorAll('.prepare_cell')[prepare_selected].querySelector('.prepare_cell-counter').textContent = 'x' + preparedShips[prepare_selected];
                        }
                    }
                }
                break;
            case 3:
                // RMC
                if (targetShip !== null) {
                    let removed = false;
                    let removedShipIdx = -1;
                    for (let i = 0; i < playerShips.length && !removed; i++) {
                        if (playerShips[i].x === targetShip.y && playerShips[i].y === targetShip.y) {
                            removed = true;
                            removedShipIdx = i;
                        }
                    }
                    (removedShipIdx !== -1) && playerShips.splice(removedShipIdx, 1);
                    targetShip.erase(battlefield_player.getMatrix());
                    battlefield_player.update();
                    battlefield_player.draw(false, true, 'c');
                    let removedIdx = (targetShip.type === SHIP_TYPE.GIANT ? 3 : (targetShip.type === SHIP_TYPE.LARGE ? 2 : (targetShip.type === SHIP_TYPE.MID ? 1 : 0)));
                    preparedShips[removedIdx]++;
                    if (preparedShips[removedIdx] > 0) 
                        document.querySelectorAll('.prepare_cell')[removedIdx].className = document.querySelectorAll('.prepare_cell')[removedIdx].className.replace(" prepare_cell--mute", "");
                    document.querySelectorAll('.prepare_cell')[removedIdx].querySelector('.prepare_cell-counter').textContent = 'x' + preparedShips[removedIdx];
                }
                break;
        }
    }
    function actionAttackClick(event) {
        if (isFinished)
            return;
        if (!isPlayer)
            return;
        let argsId = event.target.id.split('_');
        argsId[0] = ~~argsId[0].replace('o','');
        argsId[1] = ~~argsId[1];
        // { hit: hit, available: available, value: value};
        let attack_result = pl.attack(argsId[0], argsId[1]);
        updateFleetStatus(aipl.defeatedShips, pl.defeatedShips);
        addChatMessage(isPlayer, pl.madeTurns[pl.madeTurns.length - 1]);
        battlefield_ai.draw(true, false, 'o');
        if (!attack_result) {
            isPlayer = false;
            document.querySelector('.header-title').textContent = getLocalsMessage("appLabelOpponentMove");
            setTimeout(()=>{ attackAI();}, AI_TURN_DELAY);
        } else {
            isPlayer = true;
            if (checkWinCondition(aipl.defeatedShips, pl.defeatedShips) === GAME_STATE.WIN) {
                isFinished = true;
                document.querySelector('.header-title').textContent = getLocalsMessage("appLabelWin");
            } else if (checkWinCondition(aipl.defeatedShips, pl.defeatedShips) === GAME_STATE.LOSE) {
                isFinished = true;
                document.querySelector('.header-title').textContent = getLocalsMessage("appLabelLose");
            }
        }
    }
    function attackAI() {
        if (isFinished)
            return;
        let attack_result = aipl.attack();
        updateFleetStatus(aipl.defeatedShips, pl.defeatedShips);
        addChatMessage(isPlayer, aipl.madeTurns[aipl.madeTurns.length - 1]);
        battlefield_player.draw(false, false, 'c');
        if (attack_result) {
            if (checkWinCondition(aipl.defeatedShips, pl.defeatedShips) === GAME_STATE.WIN) {
                isFinished = true;
                document.querySelector('.header-title').textContent = getLocalsMessage("appLabelWin");
            } else if (checkWinCondition(aipl.defeatedShips, pl.defeatedShips) === GAME_STATE.LOSE) {
                isFinished = true;
                document.querySelector('.header-title').textContent = getLocalsMessage("appLabelLose");
            } else {
                setTimeout(()=>{ attackAI();}, AI_TURN_DELAY);
            }
        } else {
            isPlayer = true;
            document.querySelector('.header-title').textContent = getLocalsMessage("appLabelYourMoveFire");
        }
    }
    function addListenersPreparedStage() {
        for (let idx = 0, l = gameGridCells.length; idx < l; idx++) {
            //gameGridCells[idx].addEventListener('mousemove', actionMouseMove, false);
            gameGridCells[idx].addEventListener('mousedown', actionMouseClick, false);
        }
    }
    function removeListenersPreparedStage() {
        for (let idx = 0, l = gameGridCells.length; idx < l; idx++) {
            //gameGridCells[idx].removeEventListener('mousemove', actionMouseMove, false);
            gameGridCells[idx].removeEventListener('mousedown', actionMouseClick, false);
        }
    }
    function addListenersBattleStage() {
        for (let idx = 0, l = gameGridCellsAI.length; idx < l; idx++) {
            //gameGridCells[idx].addEventListener('mousemove', actionMouseMove, false);
            gameGridCellsAI[idx].addEventListener('mousedown', actionAttackClick, false);
        }
    }
    function removeListenersBattleStage() {
        for (let idx = 0, l = gameGridCellsAI.length; idx < l; idx++) {
            //gameGridCells[idx].removeEventListener('mousemove', actionMouseMove, false);
            gameGridCellsAI[idx].removeEventListener('mousedown', actionAttackClick, false);
        }
    }
    addListenersPreparedStage();
    GUILocalization();
    let prepareCells = document.querySelectorAll('.prepare_cell');
    for (let pcidx = 0, l = prepareCells.length; pcidx < l; pcidx++) {
        document.querySelectorAll('.prepare_cell')[pcidx].addEventListener('click', (event) => {
            document.querySelector('.prepare_cell--active').className = document.querySelector('.prepare_cell--active').className.replace(' prepare_cell--active', '');
            event.target.className += ' prepare_cell--active';
            document.querySelectorAll('.prepare_cell > .prepare_cell-counter')[pcidx].textContent = 'x' + preparedShips[pcidx];
            prepare_selected = pcidx;
        });
    }
    document.querySelector('.prepare_cell--active').className = document.querySelector('.prepare_cell--active').className.replace(' prepare_cell--active', '');
    document.querySelectorAll('.prepare_cell')[prepare_selected].className += ' prepare_cell--active';


    document.querySelector('.game_grid').oncontextmenu = ()=> { return false; };

    document.querySelector('select').addEventListener('change', (event) => {
        let prepField = document.querySelector('.game_wrapper');
        if (prepField.className.indexOf('show_overlay') === -1) {
            prepField.className += ' show_overlay';
        }
    });

    document.querySelector('.prepare_field-rotate_btn').addEventListener('click', (event) => {
        let prepField = document.querySelector('.prepare_field');
        prepare_horizontal = !prepare_horizontal;
        if (prepField.className.indexOf('prepare_field--rotate') === -1) {
            prepField.className += ' prepare_field--rotate';
        } else {
            prepField.className = prepField.className.replace(' prepare_field--rotate', '');
        }
    });
    document.querySelector('#newGame').addEventListener('click', (event) => {
        let prepField = document.querySelector('.game_wrapper');
        if (prepField.className.indexOf('show_overlay') === -1) {
            prepField.className += ' show_overlay';
        }
    });
    document.querySelector('.overlay-btn--yes').addEventListener('click', (event) => {
        let prepField = document.querySelector('.game_wrapper');
        prepField.className = prepField.className.replace(' show_overlay', '');
        
        (document.querySelector('.game_grid-opponent').className.indexOf('hidden') === -1) && (document.querySelector('.game_grid-opponent').className += ' hidden');
        document.querySelector('.prepare_field').className = document.querySelector('.prepare_field').className.replace(' hidden','');
        (document.querySelector('.footer').className.indexOf("footer--muted") === -1) && (document.querySelector('.footer').className += ' footer--muted');
        // TODO : update footer
        // TODO : Create New Game
        //if (screenState === GAME_SCREEN.BATTLE) {
            difficultLevel = document.querySelector('select').selectedIndex;
            addListenersPreparedStage();
            screenState = GAME_SCREEN.PREPARE;
            clearChat();
            removeListenersBattleStage();
            document.querySelector('.header-title').textContent = getLocalsMessage("appLabelPrepareStagePosition");
            //difficultLevel = DIFFICULT_LEVEL.HARD;
            battlefield_player = new Battlefield(true);
            battlefield_ai = null;
            aipl = null;
            pl = null;
            preparedShips = [4, 3, 2, 1];
            aiShips = [];
            playerShips = [];
            isPlayer = false;
            isFinished = false;
            for (let i = 0; i < 4; i++) {
                document.querySelectorAll('.prepare_cell > .prepare_cell-counter')[i].textContent = 'x' + preparedShips[i];
                document.querySelectorAll('.prepare_cell')[i].className = document.querySelectorAll('.prepare_cell')[i].className.replace(" prepare_cell--mute", "");
            }
            battlefield_player.draw(false, true, 'c');
        //}
    });
    document.querySelector('.overlay-btn--no').addEventListener('click', (event) => {
        let prepField = document.querySelector('.game_wrapper');
        prepField.className = prepField.className.replace(' show_overlay', '');
        document.querySelector('select').selectedIndex = difficultLevel;
    });
    document.querySelector('#auto').addEventListener('click', (event) => {
        if (screenState === GAME_SCREEN.PREPARE) {
            // TODO: auto position
            let friendlyShips = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < preparedShips[i]; j++) {  
                    friendlyShips.push(getSelectedShip(i));
                }
                preparedShips[i] = 0;
                document.querySelectorAll('.prepare_cell > .prepare_cell-counter')[i].textContent = 'x' + preparedShips[i];
                (document.querySelectorAll('.prepare_cell')[i].className.indexOf("prepare_cell--mute") === -1) && (document.querySelectorAll('.prepare_cell')[i].className += " prepare_cell--mute");
            }
            let placedAutoShips = placeAllShipsAuto(battlefield_player.getMatrix(), friendlyShips);
            for (let i = 0; i < placedAutoShips.length; i++) {
                playerShips.push(placedAutoShips[i]);
            }
            battlefield_player.draw(false, true, 'c');
        } else if (screenState === GAME_SCREEN.CONFIRM) {
            screenState = GAME_SCREEN.PREPARE;
            clearChat();
            document.querySelector('.prepare_field').className = document.querySelector('.prepare_field').className.replace(" prepare_field--show_overlay","");
        }
    });
    document.querySelector('#start').addEventListener('click', (event) => {
        if (screenState === GAME_SCREEN.PREPARE) {
            let isPlaced = true;
            for (let i = 0; i < 4 && isPlaced; i++) {
                if (preparedShips[i] > 0)
                    isPlaced = false;
            }
            if (isPlaced) {
                screenState = GAME_SCREEN.CONFIRM;
                document.querySelector('.prepare_field').className += " prepare_field--show_overlay";
            }
        } else if (screenState === GAME_SCREEN.CONFIRM) {
            screenState = GAME_SCREEN.BATTLE;
            document.querySelector('.prepare_field').className = document.querySelector('.prepare_field').className.replace(" prepare_field--show_overlay","");
            // TODO: run match
            document.querySelector('.game_grid-opponent').className = document.querySelector('.game_grid-opponent').className.replace(' hidden', '');
            (document.querySelector('.prepare_field').className.indexOf("hidden") === -1) && (document.querySelector('.prepare_field').className += ' hidden');
            document.querySelector('.footer').className = document.querySelector('.footer').className.replace(' footer--muted', '');

            removeListenersPreparedStage();

            battlefield_ai = new Battlefield(true);
            battlefield_player.autoPlaceholders = (difficultLevel === DIFFICULT_LEVEL.HARD ? true : false);
            aipl = new AIPlayer("AI", battlefield_player, (difficultLevel === DIFFICULT_LEVEL.HARD ? DIFFICULT_LEVEL.NORMAL: difficultLevel));
            pl = new Player("RealHero", battlefield_ai);
            aiShips = placeAllShipsAuto(battlefield_ai.getMatrix());
            updateFleetStatus(aipl.defeatedShips, pl.defeatedShips);
            battlefield_ai.draw(true, false, 'o');
            addListenersBattleStage();
            isPlayer = true;
            isFinished = false;
            document.querySelector('.header-title').textContent = getLocalsMessage("appLabelYourMoveFire");
        }
    });
});
