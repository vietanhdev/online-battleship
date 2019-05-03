from app.main import r_db


def save_token(token, exp):
    try:
        r_db.set(token, 1)
        r_db.expire(token, int(exp))
        response_object = {
            'status': 'success',
            'message': 'Successfully logged out.'
        }
        return response_object, 200
    except Exception as e:
        response_object = {
            'status': 'fail',
            'message': e
        }
        return response_object, 200