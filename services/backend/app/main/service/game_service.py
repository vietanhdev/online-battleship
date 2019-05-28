import uuid
import datetime
import time

from app.main import db
from app.main.model.user import User
from app.main.model.room import Room
from app.main.model.game import Game
from app.main.model.room_user import RoomUser

from .battleship_service import save_new_player_battleship


def get_ranking_list(delta, top):
    if delta.isdigit() and top.isdigit():
        delta = int(delta)
        top = int(top)
        try:
            datetime_object = datetime.datetime.fromtimestamp(time.time() - delta)
        except:
            response_object = {
                'state': 'fail',
                'message': 'delta of time not right'
            }
            return response_object, 400

        rooms = Room.query.filter(Room.created_at >= datetime_object).all()
        count_win = {}
        count_total = {}
        for room in rooms:
            room_users =  RoomUser.query.filter_by(room_id=room.id).all()
            for room_user in room_users:
                user_id = room_user.user_id
                is_win = room_user.is_win
                if user_id not in count_win:
                    count_win[user_id] = 0
                    count_total[user_id] = 0
                elif is_win:
                    count_win[user_id] = count_win[user_id] + 1
                    count_total[user_id] = count_total[user_id] + 1
                else:
                    count_total[user_id] = count_total[user_id] + 1
    
        data = []
        for user_id, num_win in sorted(count_win.items(), key=lambda kv: kv[1], reverse=True):
            user = User.query.filter_by(id=user_id).first()
            sub_data = user.get_user_information()
            sub_data['num_win'] = count_win[user_id]
            sub_data['num_total'] = count_total[user_id]
            data.append(sub_data)

        response_object = {
            'data': data[:top]
        }

        return response_object, 200
    

    response_object = {
        'status': 'fail',
        'message': 'day, month, year and top must be a positive integer'
    }
    return response_object, 400 


def get_all_rooms(offset, limit):
    if offset.isdigit() and limit.isdigit():
        offset = int(offset)
        limit = int(limit)
        rooms = Room.query.order_by(Room.created_at.desc()).offset(offset).limit(limit).all()
        data = []
        for room in rooms:
            data.append(room.get_room_information())
        
        response_object = {
            'status': 'success',
            'data': data
        }
        return response_object, 200

    response_object = {
        'status': 'fail',
        'message': 'offset and limit must be a positive integer'
    }
    return response_object, 400


def save_new_room(user, data):
    game_public_id = data.get('game_public_id')
    game = Game.query.filter_by(public_id=game_public_id).first()
    if game:
        new_room = Room(
            public_id=str(uuid.uuid4()),
            game_id=game.id,
            created_at=datetime.datetime.utcnow(),
            history="{}"
        )
        response_object = {
            'status': 'success',
            'message': 'Create room successfully',
            'room_public_id': new_room.public_id
        }
        
        save_new_player(new_room, user)
        
        return response_object, 201
    
    response_object = {
        'status': 'fail',
        'message': 'Invalid game identifier'
    }
    return response_object, 400


def get_all_games():
    games = Game.query.all()
    data = []
    for game in games:
        data.append(game.get_game_information())

    response_object = {
        'status': 'success',
        'data': data
    }
    return response_object, 200


def get_a_room(room_public_id):
    room = Room.query.filter_by(public_id=room_public_id).first()
    return room


def get_a_room_by_id(room_id):
    room = Room.query.filter_by(id=room_id).first()
    return room
    

def save_new_player(room, user):
    if room.get_num_player() == 0:
        a = RoomUser(creator=True)
    else:
        a = RoomUser(creator=False)
    a.user = user
    room.users.append(a)
    save_changes()
    save_new_player_battleship(user, room)


def check_player_or_viewer(room, user):
    a =  RoomUser.query.filter_by(room_id=room.id, user_id=user.id).first()
    if a is not None:
        return True
    return False
    

def save_changes(data=None):
    if data != None:
        db.session.add(data)
        db.session.commit()
    else:
        db.session.commit()
