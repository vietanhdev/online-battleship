from flask import request, g, render_template, make_response
from flask_restplus import Resource

from ..util.dto import MessageDto
from ..util.decorator import token_required

from ..service.message_service import get_private_messages, get_room_messages
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

        # Get offset and limit argument, set to 0 if not invalid
        offset = request.args.get('offset') or '0'
        limit = request.args.get('limit') or '0'

        if partner is not None:
            return get_private_messages(user.public_id, public_id, offset, limit)
        elif room is not None:
            return get_room_messages(public_id, offset, limit)
        else:
            api.abort(404)


@api.route('/test', '/test/')
class Test(Resource):
    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template('messages.html'), 200, headers)