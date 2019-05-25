from app.main import db
import json


def get_battlship_history(room):
    history = json.loads(room.history)
    hist = history.get('hist') 
    turn = history.get('turn')
    num = len(hist)
    data = {}

    for sub_hist in hist:
        user_id = sub_hist.get('user_id')
        board = sub_hist.get('board')
        ships = sub_hist.get('ships')
        data[user_id] = {}
        data[user_id]['board'] = board
        data[user_id]['ships'] = ships

    return data, turn


def save_new_player_battleship(user, room):
    history = json.loads(room.history)
    history['turn'] = user.id
    hist = history.get('hist')
    if hist is None:
        history['hist'] = []
    history['hist'].append({
        'user_id': user.id,
        'board': [[0]*10]*10,
        'ships': None
    })
    room.history = json.dumps(history)
    save_changes(room)


def save_new_ships(user, room, ships):
    history = json.loads(room.history)
    history['turn'] = user.id
    hist = history.get('hist')

    if hist is not None:
        for i in range(0, len(hist)):
            sub_hist = hist[i]
            user_id = sub_hist.get('user_id')
            if user_id == user.id:
                if sub_hist.get('ships') is None:
                    sub_hist['ships'] = ships
            hist[i] = sub_hist
        history['hist'] = hist

    room.history = json.dumps(history)
    save_changes(room)
    

def ships_to_matrix(ships):
    # check if ships is None
    if ships is None:
        return None
    
    ships_1 = ships.get('ships_1')
    ships_2 = ships.get('ships_2')
    ships_3 = ships.get('ships_3')
    ships_4 = ships.get('ships_4')
    
    # check full 4 kind of ship
    if ships_1 is None or len(ships_1) != 4:
        return None
    if ships_2 is None or len(ships_2) != 3:
        return None
    if ships_3 is None or len(ships_3) != 2:
        return None
    if ships_4 is None or len(ships_4) != 1:
        return None

    matrix = [[0]*10]*10

    for name, sub_ships in ships.items():
        len_ship = 5 - len(sub_ships)
        for i in range(0, len(sub_ships)):
            # add sink fields
            if ships[name][i].get('sink') is None: 
                ships[name][i]['sink'] = False

            ship = sub_ships[i]
            x = ship.get('x')
            y = ship.get('y')
            vertical = ship.get('vertical')
            delta_x = 0
            delta_y = 1
            if vertical is False:
                delta_x = 1
                delta_y = 0
            for i in range(0, len_ship+1):
                x = x + delta_x
                y = y + delta_y
                if  x not in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] \
                    or y not in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] \
                    or vertical is None:
                    return None
                matrix[x][y] = 1
            print(ship)
            print(matrix)

    return matrix


def process_command(user, room, command):
    response_command = None
    receive_event = None
    if command.get('name') == 'save_ships':
        ships = command.get('ships')
        # check ships condition
        matrix = ships_to_matrix(ships)
        if matrix is not None:
            save_new_ships(user, room, ships)
    return matrix


def save_changes(data=None):
    if data != None:
        db.session.add(data)
        db.session.commit()
    else:
        db.session.commit()
