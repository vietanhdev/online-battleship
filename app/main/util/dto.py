from flask_restplus import Namespace, fields


class UserDto:
    api = Namespace('user', description='user related operations')
    user = api.model('user', {
        'email': fields.String(required=True, description='user email address'),
        'username': fields.String(required=True, description='user username'),
        'password': fields.String(required=True, min_length=8, description='user password'),
        'public_id': fields.String(description='user Identifier')
    })
    create_user_req = api.model('create user request', {
        'email': fields.String(required=True, description='user email address'),
        'username': fields.String(required=True, description='user username'),
        'password': fields.String(required=True, description='user password')
    })
    update_user_req = api.model('update user request', {
        'email': fields.String(description='user email address'),
        'username': fields.String(description='user username'),
        'password': fields.String(description='user password')
    })
    update_admin_req = api.model('update admin request', {
        'admin_secret_key': fields.String(description='admin secret key')
    })


class AuthDto:
    api = Namespace('auth', description='authentication related operations')
    user_auth = api.model('auth_details', {
        'email': fields.String(required=True, description='The email address'),
        'password': fields.String(required=True, description='The user password '),
    })


class MessageDto:
    api = Namespace('message', description='messages related operation')


class GameDto:
    api = Namespace('game', description='game related operantion')
    create_room_req = api.model('room', {
        'game_public_id': fields.String(required=True, description='game indentifier')
    })
    create_game_req = api.model('game', {
        'name': fields.String(requrired=True, description='name of game'),
        'link_game': fields.String(required=True, description='link of game'),
        'link_image': fields.String(required=True, description='game image link'),
        'num_players': fields.Integer(required=True, description='number of player for one game')
    })

# class ApiDto:
#     def __init__(self, status, message=None, data=None):
#         if status == True:
#             self.status = 'success'
#         else:
#             self.status = 'fail'
#         if message != None:
#             self.message = message
#         if data != None:
#             self.data = data