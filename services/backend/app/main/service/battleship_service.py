from app.main import db
import json
from .user_service import get_a_user_by_id
from app.main.model.room_user import RoomUser

def save_winner(room, user):
    room_user = RoomUser.query.filter_by(room_id=room.id, user_id=user.id).first()
    room_user.is_win = True
    save_changes()

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
    
    if len(ships) != 10:
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
    data['my_public_id'] = user.public_id
    data['boards'] = boards
    if turn is None:
        data['turn'] = ''
        data['game_over'] = True
        data['winner'] = room.get_winner_id()
    else:
        turn_user = get_a_user_by_id(turn)
        data['turn'] = turn_user.public_id
        data['game_over'] = False
    data['room_data'] = room.get_room_information()

    return data


def get_list_squares(ship):
    list_squares = []
    x = ship.get('x')
    y = ship.get('y')
    vertical = ship.get('vertical')
    len_ship = ship.get('len_ship')

    if vertical is False:
        delta_x = 1
        delta_y = 0
    else:
        delta_x = 0
        delta_y = 1

    for i in range(0, len_ship):
        x_pos = x + delta_x * i
        y_pos = y + delta_y * i
        list_squares.append({
            'x': x_pos,
            'y': y_pos
        })

    return list_squares


def shoot(user, room, x, y):
    rival = room.get_rival(user)
    if rival is None:
        return False

    history = json.loads(room.history)
    hist = history.get('hist')
    turn = history.get('turn')
    # check if your turn
    if turn!=user.id:
        return False
    
    for i in range(0, len(hist)):
        sub_hist = hist[i]
        if sub_hist.get('user_id') == rival.id:
            board = sub_hist.get('board')
            ships = sub_hist.get('ships')
            break
    
    if board is None or ships is None:
        return False

    # return False if the square is hitted before
    if board[y][x] != 0:
        return False
    
    board[y][x] = -1
    turn = rival.id

    # check if hit the ship, then change state of square to 1
    for j in range(0, len(ships)):
        ship = ships[j]
        list_squares = get_list_squares(ship)
        # check if ship is hitted
        for square in list_squares:
            if square['x'] == x and square['y'] == y:
                board[y][x] = 1
                break
        if board[y][x] == 1:
            # check is ship is sinked
            sink = True
            for square in list_squares:
                x_pos = square['x']
                y_pos = square['y']
                if board[y_pos][x_pos] == 0:
                    sink = False
                    break
            ships[j]['sink'] = sink
            turn = user.id
            break
    
    # check if end game
    end_game = True
    for j in range(0, len(ships)):
        if ships[j]['sink'] == False:
            end_game = False
            break
    if end_game == True:
        save_winner(room, user)
        turn = None
    
    hist[i]['board'] = board
    hist[i]['ships'] = ships
    history['hist'] = hist
    history['turn'] = turn
    room.history = json.dumps(history)
    save_changes(room)
    return True


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
    elif command.get('name') == 'shoot':
        x = command.get('x')
        y = command.get('y')
        # shoot and save to history
        result = shoot(user, room, x, y)
        return result

    return False


def save_changes(data=None):
    if data != None:
        db.session.add(data)
        db.session.commit()
    else:
        db.session.commit()


