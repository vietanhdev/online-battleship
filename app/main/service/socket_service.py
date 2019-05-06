from app.main import r_db
import json

# def save_user_with_session(session_id, user_id, remain_sec):
#     r_db.set(session_id, user_id)
#     r_db.expire(session_id, int(remain_sec))


# def get_uid_by_sid(session_id):
#     return r_db.lindex(session_id, )


# def get_user_id_by_sid(session_id):
#     return r_db.get(session_id)


def save_user_id_room_id_with_sid(session_id, user_id, remain_sec, room_id=None):
    user_room = {
        'user_id': user_id,
        'room_id': room_id
    }
    return r_db.set(name=session_id, value=json.dumps(user_room), ex=int(remain_sec))


def get_user_id_by_sid(session_id):
    user_room = r_db.get(session_id)
    if user_room is None:
        return None
    user_room = json.loads(user_room)
    return user_room.get('user_id')


def get_room_id_by_sid(session_id):
    user_room = r_db.get(session_id)
    if user_room is None:
        return None
    user_room = json.loads(user_room)
    return user_room.get('room_id')


def delete_session(session_id):
    r_db.delete(session_id)