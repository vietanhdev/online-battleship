from .user_service import get_a_user, get_a_user_by_id
from .game_service import send_command, get_a_room, get_a_room_by_id

from app.main.service.auth_helper import Auth

from app.main import r_db

online_dict = {}

def login_socket(request_object):
    user = Auth.socket_logged_in_user(request_object)

    if user is None:
        response_object = {
            'status': 'fail',
            'message': 'Fail to authenticate'
        }
        return None, response_object
    
    response_object = {
        'status': 'success',
        'message': 'Authenticate successfully'
    }
    return user, response_object


def login_room_socket(request_object):
    user = Auth.socket_logged_in_user(request_object)
    room_public_id = request_object.get('room_public_id')
    room = get_a_room(room_public_id)

    if user is None:
        response_object = {
            'status': 'fail',
            'message': 'Fail to authenticate'
        }
        return None, None, response_object

    if room is None:
        response_object = {
            'status': 'fail',
            'message': 'Room not found'
        }
        return None, None, response_object
    
    response_object = {
        'status': 'success',
        'message': 'Authenticate successfully'
    }
    return user, room, response_object


def get_list_users_in_room(room):
    set_users = r_db.smembers(room.id)
    list_users = []
    for user_id in set_users:
        user = get_a_user_by_id(user_id)
        if user is not None:
            list_users.append(user.get_user_information())
    return list_users


def user_get_in_room(user, room):
    r_db.sadd(room.id, user.id)
    return get_list_users_in_room(room)


def user_get_out_room(user, room):
    r_db.srem(room.id, user.id)
    return get_list_users_in_room(room)


def get_user_and_receiver(list_user_id, receiver_public_id):
    if len(list_user_id) == 0:
        return None, None

    user_id = list_user_id[-1]
    user = get_a_user_by_id(user_id)

    receiver = get_a_user(receiver_public_id)

    return user, receiver


def get_user_and_room(list_user_id, list_room_id):
    if len(list_user_id) == 0:
        return None, None
    
    if len(list_room_id) == 0:
        return None, None
        
    user_id = list_user_id[-1]
    user = get_a_user_by_id(user_id)

    room_id = list_room_id[-1]
    room = get_a_room_by_id(room_id)

    return user, room
