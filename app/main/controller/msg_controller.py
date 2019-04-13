from flask import request, g, render_template
from flask_restplus import Resource

from ..util.dto import MsgDto
from ..util.decorator import token_required

from .. import socketio

from flask_socketio import join_room

api = MsgDto.api

parser = api.parser()
parser.add_argument('Authorization', type=str,
                    location='headers',
                    help='Bearer Access Token',
                    required=True)


# @api.route('/')
# class Description(Resource):
#     @api.doc('socket template')
#     def get(self):
#         return make_response(render_template('index.html'), 200, headers)


# @api.route('/private')
# class PrivateMsg(Resource):
#     @token_required
#     @api.doc('private messages', parser=parser)
#     def get(self):
#         """User get his/her own private message"""
#         user = g.user
#         if not user:
#             api.abort(404)
#         else:
#             return private_msg(user=user)


# @api.route('/rooms/<room_id>')
# @api.param('room_id', 'The Room identifier')
# @api.response(404, 'Room not found')
# class PrivateMsg(Resource):
#     @token_required
#     @api.doc('get room messages', parser=parser)
#     def get(self):
#         """User get room message"""
#         return room_msg(room_id=room_id)