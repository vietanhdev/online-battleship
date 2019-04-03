from app.main import db
import json


def save_ship(user, room, ships):
    history = json.loads(room.history)
    history[user.id] = {}
    history[user.id]['ships'] = ships
    history[user.id]['board'] = [0] * 100
    room.history = json.dumps(history)
    save_changes(room)


def check_sink(ship, board):
    sigma = 1
    for part in ship:
        x = part['x']
        y = part['y']
        val_part = board[x*10 + y]
        sigma = sigma * val_part
    if sigma == 1:
        return True
    return False


def check_end_game(ships, board):
    sum = 0
    for ship in ships:
        for part in ship:
            x = part['x']
            y = part['y']
            val_part = board[x*10 + y]
            sum = sum * val_part
    if sum == 20:
        return True
    return False


def check_board(x, y, ships, board):
    for ship in ships:
        for part in ship:
            if x == part['x'] and y == part['y']:
                board[x*10 + y] = 1
                if check_sink(ship, board):
                    for part in ship:
                        board[part['x']*10+part['y']] = 2
                    if check_end_game(ships, board):
                        return 3, board
                    return 2, board # board sink
                return 1, board # hit
    board[x*10 + y] = -1
    return -1, board # miss


def shoot(user, room, x, y):
    history = json.loads(room.history)

    rival = room.get_rival(user)

    # load ships and current board of rival
    rival_ships = history.get(str(rival.id)).get('ships')
    rival_board = history.get(str(rival.id)).get('board')
    print(rival_ships)
    print(rival_board)

    response_command = {
        'state': 'successful', 
        'message': 'Shoot successful'
    }

    receive_event = None

    if rival_board[x*10 + y] != 0:    # this part is already hit
        response_command = {
            'state': 'fail', 
            'message': 'You have already shot this area'
        }
    else:
        state, rival_board = check_board(x, y, rival_ships, rival_board)

        if state == -1:
            # change to rival turn if miss
            history['turn'] = rival.public_id
        elif state == 3:
            # change turn to -1, so no one can shoot
            history['turn'] = -1

        # save updated rival board after player shoots
        history[str(rival.id)]['board'] = rival_board
        room.history = json.dumps(history)
        save_changes(room)

        receive_event = {'victim_public_id': rival.public_id, 'state': state, 'board': rival_board, 'turn': get_turn(room)}

    return response_command, receive_event


def enter_command(user, room, command):
    response_command = None
    receive_event = None
    if command.get('name') == 'save_ship':
        if is_ready(room) == False:
            save_ship(user, room, command.get('ships'))
            response_command = {
                'state': 'successful',
                'message': 'Create board successful'
            }
            if is_ready(room):
                receive_event = {
                    'name': 'game-started',
                    'turn': get_turn(room)
                }
            else:
                set_turn(room, user)
        else:
            response_command = {
                'state': 'fail',
                'message': 'You are not allowed to update ships'
            }
    elif command.get('name') == 'shoot':
        if is_ready(room):
            if user.public_id == get_turn(room):
                x = command.get('x')
                y = command.get('y')
                if isinstance(x, int) and isinstance(y, int) and x in range(0, 9) and y in range(0, 9):
                    response_command, receive_event = shoot(user, room, x, y)
                else:
                    response_command = {
                        'state': 'fail',
                        'message': 'Invalid parameter'
                    }
            else:
                response_command = {
                    'state': 'fail',
                    'message': 'Not your turn'
                }
        else:
            response_command = {
                'state': 'fail',
                'message': 'Waiting for other players'
            }
    else:
        pass

    return response_command, receive_event


def get_turn(room):
    history = json.loads(room.history)
    return history.get('turn')


def set_turn(room, user):
    history = json.loads(room.history)
    history['turn'] = user.public_id
    room.history = json.dumps(history)
    save_changes(room)


def is_ready(room):
    history = json.loads(room.history)
    list_players = room.get_players()
    if room.check_num_player():
        return False
    for player in list_players:
        player_hist = history.get(str(player.id))
        if player_hist is None:
            return False
        else:
            ships = player_hist.get('ships')
            if ships is None:
                return False

    return True 


def battleship_get_history(user, room):
    history = json.loads(room.history)
    print(history)
    response_object = {}
    response_object['payload'] = []
    list_players = room.get_players()
    for player in list_players:
        player_hist = history.get(str(player.id))
        board = None
        if player_hist is not None:
            ships = player_hist.get('ships')
            board = player_hist.get('board')
            if user.id == player.id:
                payload = {
                    'public_id': player.public_id,
                    'ships': ships,
                    'board': board
                }
            else:
                payload = {
                    'public_id': player.public_id,
                    'board': board
                }
            response_object['payload'].append(payload)

    return response_object


def save_changes(data=None):
    if data != None:
        db.session.add(data)
        db.session.commit()
    else:
        db.session.commit()