
const Constants = {
    GAME_STATE : Object.freeze({
        'WIN'       : 1,
        'LOSE'      : 2,
        'CONTINUE'  : 3
    }),
    
    GAME_SCREEN : Object.freeze({
        'PREPARE' : 0,
        'CONFIRM' : 1,
        'BATTLE'  : 2
    }),
    
    SHIP_STATE : Object.freeze({
        'NORMAL'    : 0,
        'FAILED'    : 1,
        'DESTROYED' : 2
    }),
    
    DIFFICULT_LEVEL : Object.freeze({
        'EASY'    : 0,
        'NORMAL'  : 1,
        'HARD'    : 2
    }),
    
    POINT_STATE : Object.freeze({
        'CLEAN'     : 0,
        'MISS'      : 1,
        'AUTO'      : 2,
        'SHIP'      : 3,
        'ENV'       : 4,
        'DAMAGED'   : 5,
        'KILLED'    : 6
    }),
    
    DIRECTION : Object.freeze({
        'RIGHT'    : Object.freeze({dx: +1, dy:  0}),
        'DOWN'     : Object.freeze({dx:  0, dy: +1}),
        'LEFT'     : Object.freeze({dx: -1, dy:  0}),
        'UP'       : Object.freeze({dx:  0, dy: -1}),
        'NONE'     : Object.freeze({dx:  0, dy:  0}),
        'RD'       : Object.freeze({dx: +1, dy: -1}),
        'RU'       : Object.freeze({dx: +1, dy: +1}),
        'LU'       : Object.freeze({dx: -1, dy: -1}),
        'LD'       : Object.freeze({dx: -1, dy: +1})
    }),
    
    SHIP_TYPE : Object.freeze({
        'GIGANT'    : Object.freeze({ len: 4, directions: [this.DIRECTION.RIGHT, this.DIRECTION.DOWN]}),
        'LARGE'     : Object.freeze({ len: 3, directions: [this.DIRECTION.RIGHT, this.DIRECTION.DOWN]}),
        'MID'       : Object.freeze({ len: 2, directions: [this.DIRECTION.RIGHT, this.DIRECTION.DOWN]}),
        'SMALL'     : Object.freeze({ len: 1, directions: [this.DIRECTION.NONE]}),
    }),
    
    NAV_HORIZONTAL : ['1','2','3','4','5','6','7','8','9','10'],
    NAV_VERTICAL : ['A','B','C','D','E','F','J','H','I','J'],
    
    
    AI_TURN_DELAY : 1 * 1000
}

export default Constants;