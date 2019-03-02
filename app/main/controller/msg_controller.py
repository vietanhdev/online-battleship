from flask import request, g
from flask_restplus import Resource

from ..util.dto import MsgDto
from ..util.decorator import token_required

from .. import socketio

from flask_socketio import join_room

api = MsgDto.api
msg = MsgDto.msg

parser = api.parser()
parser.add_argument('Authorization', type=str,
                    location='headers',
                    help='Bearer Access Token',
                    required=True)

@api.route('/private')
class PrivateMessage(Resource):
    @token_required
    @api.doc('private messages', parser=parser)
    def get(self):
        """User get his/her own private message"""
        user = g.user
        if not user:
            api.abort(404)
        else:
            return private_msg(user=user)
