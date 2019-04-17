from functools import wraps
from flask import request, g

from app.main.service.auth_helper import Auth

# from flask_socketio import emit


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        data, status = Auth.get_logged_in_user(request)
        user = data.get('data')

        if not user:
            return data, status
        g.user = user

        return f(*args, **kwargs)

    return decorated


def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        data, status = Auth.get_logged_in_user(request)
        user = data.get('data')

        if not user:
            return data, status

        admin = user.admin
        if not admin:
            response_object = {
                'status': 'fail',
                'message': 'admin token required'
            }
            return response_object, 401
        g.user = user

        return f(*args, **kwargs)

    return decorated