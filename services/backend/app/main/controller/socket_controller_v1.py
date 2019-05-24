from flask import g, request

from ..service.user_service import get_a_user, get_a_user_by_id
from ..service.game_service import send_command, get_a_room, get_a_room_by_id
from ..service.message_service import save_new_message
from ..service.socket_service import save_user_id_room_id_with_sid, get_user_id_by_sid, get_room_id_by_sid, delete_session

from .. import socketio

from app.main.service.auth_helper import Auth

from flask_socketio import disconnect, join_room, leave_room, emit

import json


@socketio.on('connect')
def connectClient():
    print(">>>>>>>>> Client Connected on rooth path with session id " + request.sid)


@socketio.on('disconnect', namespace='/')
def deleteSessionId():
    user_id = get_user_id_by_sid(request.sid)
    user = get_a_user_by_id(user_id)

    if user:
        delete_session(session_id=request.sid)
        print('>>>>>>>>> User ' + str(user.id) + 'leave room')


@socketio.on('request_login', namespace='/')
def registerUserId(request_object):
    user, remain_sec = Auth.socket_logged_in_user(request_object)

    response_object = {
        'status': 'fail',
        'message': 'Fail to authenticate'
    }

    if user is not None:
        # save pair of session id with user id
        result = save_user_id_room_id_with_sid(session_id=request.sid, user_id=user.id, remain_sec=remain_sec)

        if result == True:
            # join private room with specific name room is user with public id
            join_room(room=user.public_id, namespace='/')
            # Notify user is authenticate successfully
            response_object = {
                'status': 'success',
                'message': 'Authenticate successfully'
            }

    emit('response_login', response_object, broadcast=False, namespace='/')
    

@socketio.on('request_private_message', namespace='/')
def newPrivateMessage(request_object):
    # Check authenticate session id
    user_id = get_user_id_by_sid(request.sid)
    user = get_a_user_by_id(user_id)

    receiver_public_id = request_object.get('receiver_public_id')
    receiver = get_a_user(receiver_public_id)

    content = request_object.get('content')

    response_object = {
        'status': 'false',
        'message': 'Fail to authenticate'
    }

    if receiver is None:
        response_object = {
            'status': 'fail',
            'message': 'Receiver not found'
        }
    else:
        # Save new message to database
        save_new_message(sender_public_id=user.public_id, receiver_public_id=receiver.public_id, content=content)

        # Send new message to receiver
        receive_object = {
            'sender_public_id': user.public_id,
            'content': content
        }
        emit('receive_message', receive_object, room=receiver_public_id, namespace='/')

        # Notify sender that message is saved and sent successful
        response_object = {
            'status': 'success',
            'message': 'Send message successfully'
        }
    
    emit('response_private_message', response_object, broadcast=False, namespace='/')


@socketio.on('request_login_with_room', namespace='/rooms')
def registerUserRoomID(request_object):
    print(request_object)
    user, remain_sec = Auth.socket_logged_in_user(request_object)
    room_public_id = request_object.get('room_public_id')
    room = get_a_room(room_public_id)

    response_object = {
        'status': 'fail',
        'message': 'Fail to authenticate'
    }

    if room is None:
        response_object = {
            'status': 'fail',
            'message': 'Room not found'
        }
    else:
        if user is not None:
            # save pair of session id with user id
            result = save_user_id_room_id_with_sid(session_id=request.sid, user_id=user.id, room_id=room.id, remain_sec=remain_sec)

            if result == True:
                # join private room with specific name room is user with public id
                join_room(room=user.public_id, namespace='/')
                join_room(room=room_public_id, namespace='/rooms')
                # Notify user is authenticate successfully
                response_object = {
                    'status': 'success',
                    'message': 'Authenticate successfully'
                }
        
    emit('response_login_with_room', response_object, broadcast=False, namespace='/rooms')


@socketio.on('request_room_message', namespace='/rooms')
def newRoomMessage(request_object):
    # Check authenticate session id
    user_id = get_user_id_by_sid(request.sid)
    user = get_a_user_by_id(user_id)

    room_id = get_room_id_by_sid(request.sid)
    room = get_a_room_by_id(room_id)

    content = request_object.get('content')

    response_object = {
        'status': 'false',
        'message': 'Fail to authenticate'
    }

    if room is None:
        response_object = {
            'status': 'false',
            'message': 'Room not found'
        }
    else:
        # Save new message to database
        new_message = save_new_message(sender_public_id=user.public_id, receiver_public_id=room.public_id, content=content)

        # Send new message to all receiver in that room
        receive_object = new_message.get_message_information()
        emit('receive_message', receive_object, room=room.public_id, namespace='/rooms')

        # Notify sender that message is saved and sent successful
        response_object = {
            'status': 'success',
            'message': 'Send message successfully'
        }
    
    emit('response_room_message', response_object, broadcast=False, namespace='/rooms')


@socketio.on('request_command', namespace='/rooms')
def newCommand(request_object):
    # check authenticate session id
    user_id = get_user_id_by_sid(request.sid)
    user = get_a_user_by_id(user_id)

    room_id = get_room_id_by_sid(request.sid)
    room = get_a_room_by_id(room_id)

    command = json.loads(request_object.get('command'))

    response_object = {
        'status': 'false',
        'message': 'Fail to authenticate'
    }

    if room is None:
        response_object = {
            'status': 'false',
            'message': 'Room not found'
        }
    else:
        if room.check_exist_player(user) == False:
            response_object = {
                'status': 'fail',
                'message': 'You are not player of this room'
            }
        else:
            response_object, receive_event = send_command(user, room, command)
            if receive_event is not None:
                emit('receive_event', receive_event, room=room_public_id, namespace='/rooms')

    emit('response_command', response_object, broadcast=False, namespace='/rooms')