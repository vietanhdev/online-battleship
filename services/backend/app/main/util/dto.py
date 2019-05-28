from flask_restplus import Namespace, fields


class UserDto:
    api = Namespace('user', description='user related operations')
    user = api.model('user', {
        'email': fields.String(required=True, description='user email address'),
        'username': fields.String(required=True, description='user username'),
        'password': fields.String(required=True, min_length=8, description='user password'),
        'bio': fields.String(required=True, description='user bio'),
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
        'bio': fields.String(description='user bio')
    })
    update_password_req = api.model('update password request', {
        'old_password': fields.String(required=True, description='user old password'),
        'new_password': fields.String(required=True, description='user new password')
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
    send_game_req = api.model('send game request', {
        'invitation_link': fields.String(required=True, description='link game request')
    })


class GameDto:
    api = Namespace('game', description='game related operation')
    create_room_req = api.model('room', {
        'game_public_id': fields.String(required=True, description='game indentifier')
    })
    create_game_req = api.model('game', {
        'name': fields.String(requrired=True, description='name of game'),
        'num_players': fields.Integer(required=True, description='number of player for one game')
    })


class FileDto:
    api = Namespace('file', description="file related operation")