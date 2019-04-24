from flask import g, request

from ..service.user_service import get_a_user_by_id
from ..service.message_service import is_private, save_new_message
from ..service.socket_service import save_new_session, delete_session, get_user_id_by_sid

from .. import socketio

from app.main.service.auth_helper import Auth

from flask_socketio import disconnect, join_room, leave_room, emit


@socketio.on('connect')
def connectClient():
    print(">>>>>>>>> Client Connected on rooth path with session id " + request.sid)


@socketio.on('disconnect', namespace='/')
def deleteSessionId():
    user_id = get_user_id_by_sid(request.sid)
    user = get_a_user_by_id(user_id)

    if user:
        delete_session(session_id=request.sid)
        print('User ' + str(user.id) + 'leave room')


@socketio.on('request_login', namespace='/')
def registerSessionId(request_object):
    user, remain_sec = Auth.socket_logged_in_user(request_object)
    if user:
        infor = {
            "user id": user.id,
            "user public id": user.public_id,
            "session id": request.sid
        }
        print(infor)

        # join private room with specific name room is user with public id
        join_room(room=user.public_id, namespace='/messages')

        # save pair of session id with user public id (room name)
        save_new_session(session_id=request.sid, user_id=user.id, remain_sec=remain_sec)

        # Notify user is authenticate successfully
        response_object = {
            'status': True,
            'message': 'Authenticate successfully'
        }
        emit('response_login', response_object, broadcast=False, namespace='/')
    else:
        print('>>>>>>>>> Disconnect to Client on rooth path (Authenticate fail)')
        disconnect()


@socketio.on('request_join_room', namespace='/rooms')
def joinRoom(request_object):
    # check authentication session id
    user_id = get_user_id_by_sid(request.sid)
    user = get_a_user_by_id(user_id)
    if not user:
        response_object = {
            'status': False,
            'message': 'Fail authenticate'
        }
        emit('response_join_room', response_object, broadcast=False, namespace='/rooms')
    else:
        # check if room exist
        room_public_id = request_object.get('room_public_id')
        private = is_private(room_public_id)
        if private is not False:
            response_object = {
                'status': False,
                'message': 'Room not found'
            }
            emit('response_join_room', response_object, broadcast=False, namespace='/rooms')
        else:
            # join session id in room name is room public id
            join_room(room=room_public_id, namespace='/rooms')
            join_room(room=room_public_id, namespace='/messages')
            # Notify user is authenticate successfully
            response_object = {
                'status': True,
                'message': 'Join room successfully'
            }
            emit('response_join_room', response_object, broadcast=False, namespace='/rooms')


@socketio.on('request_message', namespace='/messages')
def newMessage(request_object):
    # check authenticate session id
    user_id = get_user_id_by_sid(request.sid)
    user = get_a_user_by_id(user_id)
    if not user:
        response_object = {
            'status': False,
            'message': 'Fail authenticate'
        }
        emit('response_message', response_object, broadcast=False, namespace='/messages')
    else:
        # check if receiver exist
        receiver_public_id = request_object.get('receiver_public_id')
        private = is_private(receiver_public_id)
        if private is None:
            response_object = {
                'status': False,
                'message': 'Receiver not found'
            }
            emit('response_message', response_object, broadcast=False, namespace='/messages')
        else:
            # send and save message
            content = request_object.get('content')

            # Save new message to database
            save_new_message(sender_public_id=user.public_id, receiver_public_id=receiver_public_id, content=content)

            # Send the new message to receiver (who in the room name is receiver_id)
            response_object = {
                'sender_public_id': user.public_id,
                'content': content
            }
            emit('receive_message', response_object, room=receiver_public_id, namespace='/messages')

            # Notify the user/sender (who in room name is his/her public id) is the message was sent and saved successfully
            response_object = {
                'status': True,
                'message': 'Send message successfully'
            }
            emit('response_message', response_object, broadcast=False, namespace='/messages')