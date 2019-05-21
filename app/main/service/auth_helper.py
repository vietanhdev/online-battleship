from app.main.model.user import User
from ..service.blacklist_service import save_token


class Auth:

    @staticmethod
    def login_user(data):
        try:
            # fetch the user data
            user = User.query.filter_by(email=data.get('email')).first()
            if user and user.check_password(data.get('password')):
                auth_token = user.encode_auth_token(user.id)
                if auth_token:
                    response_object = {
                        'status': 'success',
                        'message': 'Successfully logged in.',
                        'data': {
                            'email': user.email,
                            'username': user.username,
                            'bio': user.bio,
                            'token': auth_token.decode()
                        } 
                    }
                    return response_object, 200
            else:
                response_object = {
                    'status': 'fail',
                    'message': 'email or password does not match.'
                }
                return response_object, 401

        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 500

    @staticmethod
    def logout_user(new_request):
        # get the auth token
        data = new_request.headers.get('Authorization')
        if data:
            auth_token = data.split(" ")[-1]
        else:
            auth_token = ''
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                # mark the token as blacklisted
                remain_sec = resp[1]
                return save_token(token=auth_token, exp=remain_sec)
            else:
                response_object = {
                    'status': 'fail',
                    'message': resp
                }
                return response_object, 401
        else:
            response_object = {
                'status': 'fail',
                'message': 'Provide a valid auth token.'
            }
            return response_object, 403
    
    @staticmethod
    def get_logged_in_user(new_request):
        # get the auth token
        data = new_request.headers.get('Authorization') 
        if data:
            auth_token = data.split(" ")[-1]
        else:
            auth_token = ''
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                id = resp[0]
                user = User.query.filter_by(id=id).first()
                response_object = {
                    'status': 'success',
                    'data': user
                }
                return response_object, 200
            response_object = {
                'status': 'fail',
                'message': resp
            }
            return response_object, 401
        else:
            response_object = {
                'status': 'fail',
                'message': 'Provide a valid auth token.'
            }
            return response_object, 403
    

    @staticmethod
    def socket_logged_in_user(request_object):
        data = request_object.get('authorization')
        if data:
            auth_token = data.split(" ")[-1]
        else:
            auth_token = ''

        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                id = resp[0]
                remain_sec = resp[1]
                user = User.query.filter_by(id=id).first()
                
                return user

        return None