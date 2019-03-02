import datetime

from app.main import db
from app.main.model.user import User
from app.main.model.msg import Msg

def private_msg(user):
    response_object = {
        'status': 'success',
        'data': []
    }
    return response_object


def room_msg(user):
    response_object = {
        'status': 'success',
        'data': []
    }
    return response_object
