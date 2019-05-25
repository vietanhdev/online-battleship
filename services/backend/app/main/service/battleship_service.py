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


def enter_command(user, room, command):
    pass


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
    

def check_ships(ships):
    if ships is None:
        return False
    return True


def process_command(user, room, command):
    response_command = None
    receive_event = None
    if command.get('name') == 'save_ships':
        ships = command.get('ships')
        # check ships condition
        if check_ships(ships):
            save_new_ships(user, room, ships)



def save_changes(data=None):
    if data != None:
        db.session.add(data)
        db.session.commit()
    else:
        db.session.commit()
