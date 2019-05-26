from app.main import db
import json
from .user_service import get_a_user_by_id


def save_new_player_battleship(user, room):
    history = json.loads(room.history)
    history['turn'] = user.id
    hist = history.get('hist')
    if hist is None:
        history['hist'] = []
    history['hist'].append({
        'user_id': user.id,
        'board': [[0]*10 for _ in range(10)],
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


def init_ships(ships):
    if ships is None:
        return False
    
    for ship in ships:
        x = ship.get('x')
        y = ship.get('y')
        vertical = ship.get('vertical')
        len_ship = ship.get('len_ship')
        if vertical not in [False, True] \
            or len_ship not in [1, 2, 3, 4]:
            return False

        if vertical is False:
            delta_x = 1
            delta_y = 0
        else:
            delta_x = 0
            delta_y = 1

        for i in range(0, len_ship):
            x_pos = x + delta_x * i
            y_pos = y + delta_y * i
            if  x_pos not in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] \
                or y_pos not in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] \
                or vertical is None:
                return False
    
    for i in range(0, len(ships)):
        ships[i]['sink'] = False

    return True


def get_data(user, room):
    data = {}
    data['is_enough_player'] = room.is_enough_players()
    data['is_player'] = room.check_exist_player(user)
    history = json.loads(room.history)
    hist = history.get('hist') 
    turn = history.get('turn')

    boards = []
    for sub_hist in hist:
        player_id = sub_hist.get('user_id')
        board = sub_hist.get('board')
        ships = sub_hist.get('ships')
        player = get_a_user_by_id(player_id)
        visible = player.id == user.id
        visible_ships = []
        ships_ready = ships is not None
        if ships_ready:
            for i in range(0, len(ships)):
                if ships[i].get('sink') == False and not visible:
                    pass
                else:
                    visible_ships.append(ships[i])
        boards.append({
            'user_public_id': player.public_id,
            'board': board,
            'ships_ready': ships_ready,
            'ships': visible_ships,
            'turn': turn==player.id
        })
    data['boards'] = boards
    turn_user = get_a_user_by_id(turn)
    data['turn'] = turn_user.public_id

    return data


def shoot(user, room, x, y):
    history = json.loads(room.history)
    hist = history.get('hist')
    turn = history.get('turn')


def process_command(user, room, command):
    response_command = None
    receive_event = None
    if command.get('name') == 'save_ships':
        ships = command.get('ships')
        # check ships condition
        result = init_ships(ships)
        if result:
            save_new_ships(user, room, ships)
        return result
    if command.get('name') == 'shoot':
        x = command.get('x')
        y = command.get('y')
        result = shoot(user, room, x, y)

    return False


def save_changes(data=None):
    if data != None:
        db.session.add(data)
        db.session.commit()
    else:
        db.session.commit()


