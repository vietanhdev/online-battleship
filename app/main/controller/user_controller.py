from flask import request, g
from flask_restplus import Resource

from ..util.dto import UserDto
from ..util.decorator import token_required, admin_token_required

from ..service.user_service import save_new_user, get_all_users, get_a_user, save_updated_user, update_admin_user

api = UserDto.api
_user = UserDto.user
create_user_req = UserDto.create_user_req
update_user_req = UserDto.update_user_req
update_admin_req = UserDto.update_admin_req
update_admin_req = UserDto.update_admin_req

auth_parser = api.parser()
auth_parser.add_argument('Authorization', type=str,
                    location='headers',
                    help='Bearer Access Token',
                    required=True)

@api.route('/')
class UserList(Resource):
    @api.doc('list of registered users')
    def get(self):
        """List all registered users"""
        return get_all_users()

    @api.doc('create a new user', body=create_user_req, validate=True)
    def post(self):
        """Creates a new User """
        data = request.json
        return save_new_user(data=data)


@api.route('/<public_id>')
@api.param('public_id', 'The User identifier')
class UserWithId(Resource):
    @api.doc('get a user')
    def get(self, public_id):
        """Get a user given its identifier"""
        user = get_a_user(public_id)
        if not user:
            api.abort(404)
        else:
            return user.get_user_information()

    @admin_token_required
    @api.doc('update a user', parser=auth_parser, body=update_user_req, validate=True)
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
    @api.doc('get your own information', parser=auth_parser)
    def get(self):
        """User get his/her own information"""
        user = g.user
        if not user:
            api.abort(404)
        else:
            return user.get_user_information()

    @token_required
    @api.doc('update your own information', parser=auth_parser, body=update_user_req, validate=True)
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
    @api.doc('update admin privilege', parser=auth_parser, body=update_admin_req)
    def post(self):
        """Update normal account to admin account"""
        user = g.user
        data = request.json
        key = data['admin_secret_key']
        return update_admin_user(user=user, key=key)
