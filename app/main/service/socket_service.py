from app.main import r_db


def save_user_with_session(session_id, user_id, remain_sec):
    r_db.set(session_id, user_id)
    r_db.expire(session_id, int(remain_sec))


def get_uid_by_sid(session_id):
    return r_db.lindex(session_id, )


def get_user_id_by_sid(session_id):
    return r_db.get(session_id)


def delete_session(session_id):
    r_db.delete(session_id)