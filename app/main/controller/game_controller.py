from flask import request, g
from flask_restplus import Resource

from ..util.dto import GameDto
from ..util.decorator import admin_token_required, token_required

from ..service.game_service import dummy, get_all_rooms, save_new_room

api = GameDto.api
create_room_req = GameDto.create_room_req


ol_parser = api.parser()
ol_parser.add_argument('offset', type=int,
                    location='args',
                    help='offset')
ol_parser.add_argument('limit', type=int,
                    location='args',
                    help='limit')

auth_parser = api.parser()
auth_parser.add_argument('Authorization', type=str,
                    location='headers',
                    help='Bearer Access Token',
                    required=True)


@api.route('/rooms')
class RoomList(Resource):
    @api.doc('list of rooms', parser=ol_parser, validate=True)
    def get(self):
        """List all rooms"""
        # Get offset and limit argument, set to 0 if not invalid
        offset = request.args.get('offset') or 0
        limit = request.args.get('limit') or 0

        return get_all_rooms(offset=offset, limit=limit)
    
    @token_required
    @api.doc('create new room', parser=auth_parser, body=create_room_req, validate=True)
    def post(self):
        """Create a new Room"""
        user = g.user
        if not user:
            api.abort(404)
        else:
            # create room
            data = request.json
            return save_new_room(user=user, data=data)


@api.route('/games')

