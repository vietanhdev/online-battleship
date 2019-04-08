from flask_restplus import Namespace, fields


class UserDto:
    api = Namespace('user', description='user related operations')
    user = api.model('user', {
        'email': fields.String(required=True, description='user email address'),
        'username': fields.String(required=True, description='user username'),
        'password': fields.String(required=True, description='user password'),
        'public_id': fields.String(description='user Identifier')
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

class MsgDto:
    api = Namespace('msg', description='messages related operation')
    msg = api.model('message', {
        'receiver_id': fields.String(required=True, description='receiver id, user id if private, else room id'),
        'content': fields.String(required=True, description='content of message'), 
        'is_private': fields.String(required=True, description='is it private message ?')
    })