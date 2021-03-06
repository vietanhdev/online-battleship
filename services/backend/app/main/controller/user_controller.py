from flask import request, g
from flask_restplus import Resource, abort

from app.main.service.auth_helper import Auth
from ..util.dto import UserDto
from ..util.decorator import token_required, admin_token_required

from ..service.user_service import save_new_user, get_all_users, get_a_user, save_updated_user, save_updated_password, update_admin_user, save_new_follower, delete_follower, get_all_followers, get_all_followings

api = UserDto.api
_user = UserDto.user
create_user_req = UserDto.create_user_req
update_user_req = UserDto.update_user_req
update_password_req = UserDto.update_password_req
update_admin_req = UserDto.update_admin_req
update_admin_req = UserDto.update_admin_req

auth_parser = api.parser()
auth_parser.add_argument('Authorization', type=str,
                    location='headers',
                    help='Bearer Access Token',
                    required=True)


@api.route('', '/')
class Users(Resource):
    @api.doc('list of registered users')
    def get(self):
        """List all registered users"""
        return get_all_users()

    @api.doc('create a new user', body=create_user_req, validate=True)
    def post(self):
        """Creates a new User """
        data = request.json
        return save_new_user(data=data)


@api.route('/<public_id>', '/<public_id>/')
@api.param('public_id', 'The User identifier')
class UserWithId(Resource):
    @api.doc('get a user')
    def get(self, public_id):
        """Get a user by given identifier"""
        user = get_a_user(public_id)
        if not user:
            abort(404, 'page not found', status="fail")
        else:
            data = user.get_user_information()
            response_object = {
                'status': 'success',
                'data': data
            }
            return response_object

    @admin_token_required
    @api.doc('update a user', parser=auth_parser, body=update_user_req, validate=True)
    def post(self, public_id):
        """Admin update a user by given identifier"""
        user = get_a_user(public_id)
        if not user:
            abort(404, 'page not found', status="fail")
        else:
            data = request.json
            return save_updated_user(user=user, data=data)


@api.route('/my_account', '/my_account/')
class MyAccount(Resource):
    @token_required
    @api.doc('get your own information', parser=auth_parser)
    def get(self):
        """User get his/her own information"""
        user = g.user
        data = user.get_user_information()
        response_object = {
            'status': 'success',
            'data': data
        }
        return response_object

    @token_required
    @api.doc('Update your own information', parser=auth_parser, body=update_user_req, validate=True)
    def put(self):
        """User update his/her own information"""
        user = g.user
        data = request.json
        return save_updated_user(user=user, data=data)


@api.route('/my_account/new_password', '/my_account/new_password/')
class update_password(Resource):
    @token_required
    @api.doc('Update new password', parser=auth_parser, body=update_password_req, validate=True)
    def put(self):
        """User update new password"""
        user = g.user

        data = request.json
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        data = {
            'email': user.email,
            'password': old_password
        }
        res, status = Auth.login_user(data=data)
        if status != 200:
            response_object = {
                'status': 'fail',
                'message': 'Wrong old password'
            }
            return response_object, 401
        return save_updated_password(user, new_password)
        

@api.route('/followers', '/followers/')
class GetAllFollowers(Resource):
    @token_required
    @api.doc('get all followers')
    def get(self):
        """Get all followers"""
        user = g.user 
        return get_all_followers(user)


@api.route('/followings', '/followings/')
class GetAllFollowings(Resource):
    @token_required
    @api.doc('get all followers')
    def get(self):
        """Get all followers"""
        user = g.user 
        return get_all_followings(user)


@api.route('/friendships/<public_id>', '/friendships/<public_id>/')
@api.route('/followings/<public_id>', '/followings/<public_id>/')
@api.param('public_id', 'The Following identifier')
class FollowUser(Resource):
    @token_required
    @api.doc('follow user')
    def post(self, public_id):
        """Follow user with id"""
        follower = g.user
        user = get_a_user(public_id)
        if not user:
            abort(404, 'User not found!')
        if follower.id == user.id:
            response_object = {
                'status': 'fail',
                'message': 'You can not follow your self'
            }
            return response_object, 400
        return save_new_follower(follower, user)

    
    @token_required
    @api.doc('unfollow user')
    def delete(self, public_id):
        """Unfollow user with id"""
        follower = g.user 
        user = get_a_user(public_id)
        if not user:
            abort(404, 'User ID not found!')
        return delete_follower(follower, user)