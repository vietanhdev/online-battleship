from flask import request, g, render_template, make_response
from flask_restplus import Resource

from ..util.dto import GameDto
from ..util.decorator import admin_token_required, token_required

from ..service.game_service import get_all_rooms, save_new_room, get_all_games, save_new_game, get_a_room, save_new_player
from ..service.battleship_service import battleship_get_history

from flask_socketio import send, emit
from .. import socketio


api = GameDto.api
create_room_req = GameDto.create_room_req
create_game_req = GameDto.create_game_req


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
        offset = request.args.get('offset') or '0'
        limit = request.args.get('limit') or '0'
        return get_all_rooms(offset=offset, limit=limit)
    
    @token_required
    @api.doc('create a new room', parser=auth_parser, body=create_room_req, validate=True)
    def post(self):
        """Create a new Room"""
        user = g.user
        data = request.json
        return save_new_room(user=user, data=data)


@api.route('/rooms/<room_public_id>')
@api.param('room_public_id', 'The Room indentirfier')
class RoomWithId(Resource):
    @token_required
    @api.doc('get a room', parser=auth_parser)
    def get(self, room_public_id):
        """Get a room given its identifier"""
        user = g.user
        room = get_a_room(room_public_id)
        if not room:
            api.abort(404)
        else:
            # Add user until game room have enough players
            if room.check_num_player():
                if room.check_exist_player(user) ==  False:
                    save_new_player(room, user)
            data = room.get_room_information()
            data['history'] = battleship_get_history(user, room)
            response_object = {
                'status': 'success',
                'data': data
            }
            return response_object


@api.route('/')
class GameList(Resource):
    @api.doc('list of games')
    def get(self):
        """List of games"""
        return get_all_games()
    
    # @admin_token_required
    # @api.doc('create a new game', parser=auth_parser, body=create_game_req, validate=True)
    # def post(self):
    #     """Create a new Game"""
    #     data = request.json
    #     return save_new_game(data=data)

    def post(self):
        """Create new games"""
        data = {
            'name': 'battle ship',
            'num_players': 2
        }
        return save_new_game(data)
        
        

@api.route('/test')
class Test(Resource):
    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template('games.html'), 200, headers)

