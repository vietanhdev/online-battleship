from flask import request
from flask_restplus import Resource

from app.main.service.auth_helper import Auth
from ..util.dto import AuthDto
from ..util.decorator import token_required

from werkzeug.exceptions import BadRequest

api = AuthDto.api
user_auth = AuthDto.user_auth

auth_parser = api.parser()
auth_parser.add_argument('Authorization', type=str,
                    location='headers',
                    help='Bearer Access Token',
                    required=True)


@api.route('', '/')
class Log(Resource):
    """
    User Login and Logout Resource
    """
    @api.doc('user login')
    @api.expect(user_auth, validate=True)
    def post(self):
        """login user"""
        # get the post data
        post_data = request.json
        return Auth.login_user(data=post_data)
    
    @token_required
    @api.doc('user logout',parser=auth_parser)
    def delete(self):
        """logout user with token"""
        # get auth token
        return Auth.logout_user(new_request=request)