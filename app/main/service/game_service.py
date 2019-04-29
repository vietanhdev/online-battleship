import uuid
import datetime

from app.main import db
from app.main.model.user import User
from app.main.model.room import Room
from app.main.model.game import Game
from app.main.model.room_user import RoomUser


def get_all_rooms(offset, limit):
    if offset.isdigit() and limit.isdigit():
        offset = int(offset)
        rooms = Room.query.offset(offset).limit(limit).all()
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
            created_at=datetime.datetime.utcnow()
        )
        response_object = {
            'status': 'success',
            'message': 'Create room successfully',
            'room_public_id': new_room.public_id,
        }
        a = RoomUser()
        a.user = user
        new_room.users.append(a)
        save_changes(new_room)
        
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


def save_new_game(data):
    if str(data.get('num_players')).isdigit():
        new_game = Game(
            public_id=str(uuid.uuid4()),
            name=data.get('name'),
            link_image=data.get('link_image'),
            link_game=data.get('link_game'),
            num_players=data.get('num_players')
        )
        save_changes(new_game)
        response_object = {
            'status': 'success',
            'public_id': new_game.public_id,
            'message': 'Create game successfully'
        }
        return response_object, 201

    response_object = {
        'status': 'fail',
        'message': 'The number of players must be a positive integer'
    }
    return response_object, 400


def save_new_player(room, user):
    a = RoomUser()
    a.user = user
    room.users.append(a)
    save_changes()


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


# class battle_ship_game:
#     def __init__(player1_id, player2_id):
#         self.player1_id = player1_id
#         self.player2_id = player2_id
    
#     def  


def get_history(history, dict_id, user_id):
    # if dict_id['game_id'] == 1:
    #     battle_ship(user_id = user_id, )
    return None