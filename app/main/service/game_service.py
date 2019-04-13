import uuid
import datetime

from app.main import db
from app.main.model.user import User
from app.main.model.room import Room


def dummy():
    return "Hello World"


def get_all_rooms(offset, limit):
    if offset.isdigit() and limit.isdigit():
        offset = int(offset)
        rooms = Room.query.offset(offset).limit(limit).all()
        return rooms
    response_object = {
        'status': 'fail',
        'message': 'offset and limit must be a positive integer'
    }
    return response_object


def save_new_room(user, data):
    new_room = Room(
        public_id=str(uuid.uuid4()),
        game_id=data['game_id'],
        created_at=datetime.datetime.utcnow()
    )
    response_object = {
        'status': 'success',
        'public_id': new_room.public_id,
        'message': 'Create room successfully'
    }
    return response_object, 200