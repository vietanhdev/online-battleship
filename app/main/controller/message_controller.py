from flask import request, g, render_template, make_response
from flask_restplus import Resource

from ..util.dto import MessageDto
from ..util.decorator import token_required

from ..service.message_service import get_messages
from ..service.user_service import get_a_user
from ..service.game_service import get_a_room
from .. import socketio

from flask_socketio import join_room

api = MessageDto.api

auth_ol_parser = api.parser()
auth_ol_parser.add_argument('Authorization', type=str,
                    location='headers',
                    help='Bearer Access Token',
                    required=True)
auth_ol_parser.add_argument('offset', type=int,
                    location='args',
                    help='offset')
auth_ol_parser.add_argument('limit', type=int,
                    location='args',
                    help='limit')


@api.route('/<public_id>')
@api.param('public_id', 'The public id of user or room')
class MessageList(Resource):
    @token_required
    @api.doc('list of messages', parser=auth_ol_parser, validate=True)
    def get(self, public_id):
        """List all personal messages"""
        user = g.user

        partner = get_a_user(public_id)
        room = get_a_room(public_id)

        if partner is not None or room is not None:
            # Get offset and limit argument, set to 0 if not invalid
            offset = request.args.get('offset') or '0'
            limit = request.args.get('limit') or '0'
            return get_messages(user.public_id, public_id, offset, limit)
        else:
            api.abort(404)

        if offset.isdigit() and limit.isdigit():
            user = g.user

            data = []
            
            messages = get_messages(user.public_id, public_id, offset=offset, limit=limit)
            
            if messages:
                for message in messages:
                    data.append(message.get_message_information())
            
            response_object = {
                'status': 'success',
                'data': data
            }
        else:
            response_object = {
                'status': 'fail',
                'message': 'offset and limit must be a positive integer'
            }

        return response_object


@api.route('/test', '/test/')
class Test(Resource):
    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template('messages.html'), 200, headers)