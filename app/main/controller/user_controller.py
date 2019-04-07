from flask import request, g
from flask_restplus import Resource

from ..util.dto import UserDto
from ..util.decorator import token_required, admin_token_required
from ..service.user_service import save_new_user, get_all_users, get_a_user, save_updated_user, update_admin_user

api = UserDto.api
_user = UserDto.user
update_user_req = UserDto.update_user_req
update_admin_req = UserDto.update_admin_req
update_admin_req = UserDto.update_admin_req

parser = api.parser()
parser.add_argument('Authorization', type=str,
                    location='headers',
                    help='Bearer Access Token',
                    required=True)

@api.route('/')
class UserList(Resource):
    @api.doc('list_of_registered_users')
    @api.marshal_list_with(_user, envelope='data')
    def get(self):
        """List all registered users"""
        return get_all_users()

    @api.response(201, 'User successfully created.')
    @api.doc('create a new user')
    @api.expect(_user, validate=True)
    def post(self):
        """Creates a new User """
        data = request.json
        return save_new_user(data=data)


@api.route('/<public_id>')
@api.param('public_id', 'The User identifier')
@api.response(404, 'User not found.')
class User(Resource):
    @api.doc('get a user')
    @api.marshal_with(_user)
    def get(self, public_id):
        """Get a user given its identifier"""
        user = get_a_user(public_id)
        if not user:
            api.abort(404)
        else:
            return user

    @admin_token_required
    @api.doc('update a user', parser=parser, body=update_user_req, validate=True)
    def post(self, public_id):
        """Admin update a user given its identifier"""
        user = get_a_user(public_id)
        if not user:
            api.abort(404)
        else:
            # update user's information
            data = request.json
            return save_updated_user(public_id=public_id, data=data)


@api.route('/my_account')
class MyAccount(Resource):
    @token_required
    @api.doc('get your own information', parser=parser)
    @api.marshal_with(_user)
    def get(self):
        """User get his/her own information"""
        user = g.user
        if not user:
            api.abort(404)
        else:
            return user

    @token_required
    @api.doc('update your own information', parser=parser, body=update_user_req, validate=True)
    def post(self):
        """User update his/her own information"""
        user = g.user
        if not user:
            api.abort(404)
        else:
            # update user's information
            data = request.json
            return save_updated_user(user=user, data=data)


@api.route('/admin')
class Admin(Resource):
    @token_required
    @api.doc('update admin privilege', parser=parser, body=update_admin_req)
    def post(self):
        """Update normal account to admin account"""
        user = g.user
        data = request.json
        key = data['admin_secret_key']
        return update_admin_user(user=user, key=key)
