from flask import g, request

from ..service.socket_service import get_user_and_receiver, get_user_by_sid, get_room_by_sid, login_socket, login_room_socket, user_get_in_room, user_get_out_room, get_online_followings, user_online, user_offline, get_list_users_in_room, get_list_users_infor_in_room
from ..service.battleship_service import get_data, process_command
from ..service.message_service import save_new_message
from .. import socketio

from flask_socketio import disconnect, join_room, leave_room, emit, rooms

import json


@socketio.on('connect')
def connectClient():
	print(">>>>>>>>> Client connected on rooth path with session id " + request.sid)


def update_list_users_in_room(list_users_in_room, room):
	response_object = {
		'users_in_room': list_users_in_room
	}
	emit('users_in_room', response_object, room=room.public_id, namespace='/rooms')


# def update_list_online_followings(list_online_followings, user):
# 	response_object = {
# 		'online_followings': list_online_followings
# 	}
# 	emit('online_followings', response_object, room=user.id, namespace='/')


@socketio.on('disconnect')
def disconnectClient():
	print(">>>>>>>>> Client disconnected on rooth path with session id " + request.sid)
	# Check with room
	list_user_id = rooms(sid=request.sid, namespace="/user_id")
	list_room_id = rooms(sid=request.sid, namespace="/room_id")

	user = get_user_by_sid(list_user_id)
	room = get_room_by_sid(list_room_id)

	if user is not None and room is not None:
		list_users_in_room = user_get_out_room(user, room)
		update_list_users_in_room(list_users_in_room, room)


	# Check with user
	# if user is not None:
	# 	list_online_followings = user_offline(user)
	# 	update_list_online_followings(list_online_following, user)


@socketio.on('request_login', namespace='/')
def registerUserId(request_object):
	user, response_object = login_socket(request_object)
	# Notify sender response result
	emit('response_login', response_object, broadcast=False, namespace='/')
	
	if user is not None:
		# join room to authenticate
		join_room(room=user.id, namespace='/user_id')
		# join room to get message
		join_room(room=user.id, namespace='/')

		# list_online_followings = user_online(user)
		# update_list_online_followings(list_online_followings, user)


@socketio.on('request_login', namespace='/rooms')
def registerUserRoomID(request_object):
	user, room, response_object = login_room_socket(request_object)
	# Notify sender response result
	emit('response_login', response_object, broadcast=False, namespace='/rooms')

	if user is not None and room is not None:
		# join room to authenticate
		join_room(room=user.id, namespace='/user_id')
		join_room(room=room.id, namespace='/room_id')
		# join room to get message and event
		join_room(room=room.public_id, namespace='/rooms')
		join_room(room=user.public_id, namespace='/rooms')
		join_room(room=user.id, namespace='/')

		list_users_in_room = user_get_in_room(user, room)
		update_list_users_in_room(list_users_in_room, room)

		update_boards(user, room)


@socketio.on('send_message', namespace='/')
def newPrivateMessage(request_object):
	# Check authenticate session id
	list_user_id = rooms(sid=request.sid, namespace="/user_id")
	receiver_public_id = request_object.get('receiver_public_id')
	user, receiver = get_user_and_receiver(list_user_id, receiver_public_id)

	if user is None:
		response_object = {
			'status': 'false',
			'message': 'Fail to authenticate'
		}
	elif receiver is None:
		response_object = {
			'status': 'false',
			'message': 'Receiver public id not found'
		}
	else:
		response_object = {
			'status': 'success',
			'message': 'Send message successfully'
		}
		# Save new message to database
		content = request_object.get('content')
		new_message = save_new_message(sender_public_id=user.public_id, receiver_public_id=receiver.public_id, content=content)
		# Send new message to all receiver in that room
		receive_object = new_message.get_message_information()
		emit('new_message', receive_object, room=user.id, namespace='/')
		emit('new_message', receive_object, room=receiver.id, namespace='/')

	# Notify sender response result
	emit('response_send_message', response_object, broadcast=False, namespace='/')


@socketio.on('send_message', namespace='/rooms')
def newRoomMessage(request_object):
	# Check authenticate session id
	list_user_id = rooms(sid=request.sid, namespace="/user_id")
	list_room_id = rooms(sid=request.sid, namespace="/room_id")

	user = get_user_by_sid(list_user_id)
	room = get_room_by_sid(list_room_id)

	if user is None:
		response_object = {
			'status': 'false',
			'message': 'Fail to authenticate'
		}
	elif room is None:
		response_object = {
			'status': 'false',
			'message': 'Room not found'
		}
	else:
		response_object = {
			'status': 'success',
			'message': 'Send message successfully'
		}
		# Save new message to database
		content = request_object.get('content')
		new_message = save_new_message(sender_public_id=user.public_id, receiver_public_id=room.public_id, content=content)
		# Send new message to all receiver in that room
		receive_object = new_message.get_message_information()
		emit('new_message', receive_object, room=room.public_id, namespace='/rooms')

	# Notify sender response result
	emit('response_send_message', response_object, broadcast=False, namespace='/rooms')


@socketio.on('request_command', namespace='/rooms')
def newCommand(request_object):
	# Check authenticate session id
	list_user_id = rooms(sid=request.sid, namespace="/user_id")
	list_room_id = rooms(sid=request.sid, namespace="/room_id")

	user = get_user_by_sid(list_user_id)
	room = get_room_by_sid(list_room_id)

	if user is None:
		response_object = {
			'status': 'false',
			'message': 'Fail to authenticate'
		}
	elif room is None:
		response_object = {
			'status': 'false',
			'message': 'Room not found'
		}
	else:
		response_object = {
			'status': 'success',
			'message': 'Send command successfully'
		}
		if room.check_exist_player(user) == False:
			response_object = {
                'status': 'fail',
                'message': 'You are not player of this room'
            }
		else:
			command = request_object.get('command')
			if process_command(user, room, command) is False:
				response_object = {
					'status': 'fail',
					'message': 'Please check your command'
				}

			list_users = get_list_users_in_room(room)
			for user in list_users:
				update_boards(user, room)

    # Notify sender response result
	emit('response_command', response_object, broadcast=False, namespace='/rooms')


def update_boards(user, room):
	data = get_data(user, room)
	data['name'] = 'update_boards'
	emit('receive_event', data, room=user.public_id, namespace='/rooms')


