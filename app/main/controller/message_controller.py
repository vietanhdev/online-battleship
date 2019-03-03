from flask import request, g, render_template, make_response
from flask_restplus import Resource

from ..util.dto import MessageDto
from ..util.decorator import token_required

from ..service.message_service import is_private, get_private_messages, get_room_messages

from .. import socketio

from flask_socketio import join_room

api = MessageDto.api

auth_parser = api.parser()
auth_parser.add_argument('Authorization', type=str,
                    location='headers',
                    help='Bearer Access Token',
                    required=True)


@api.route('/<public_id>')
@api.param('public_id', 'The public id of user or room')
class MessageList(Resource):
    @token_required
    @api.doc('list of messages', parser=auth_parser, validate=True)
    def get(self, public_id):
        """List all personal messages"""
        user = g.user
        private = is_private(public_id)

        if private is None:
            abort(404)

        data = {'send_messages': [], 'receive_messages': []}
        
        if private is True:
            messages = get_private_messages(user.public_id, public_id)
        else:
            messages = get_room_messages(public_id)
        
        if messages:
            for message in messages:
                data.append(message.get_message_information())
        
        response_object = {
            'status': 'success',
            'data': data
        }

        return response_object


@api.route('/test')
class Test(Resource):
    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template('messages.html'), 200, headers)