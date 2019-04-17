import datetime

from app.main import db
from app.main.model.message import Message

from .user_service import get_a_user
from .game_service import get_a_room


def is_private(public_id):
    # check if user
    user = get_a_user(public_id)
    if user:
        return True

    # if not user, check if room
    room = get_a_room(public_id)
    if room:
        return False

    # if bot not, return None
    return None


def get_private_messages(self_public_id, partner_public_id):
    messages = Message.query.filter( (Message.sender_public_id==self_id, Message.receiver_public_id==partner_id) | (Message.sender_public_id==partner_id, Message.receiver_public_id==self_id) ).order_by(Message.created_at.desc()).all()
    return messages


def get_room_messages(room_public_id):
    messages = Message.query.filter(Message.receiver_public_id==room_public_id).order_by(Message.created_at.desc()).all()
    return messages


def save_new_message(sender_public_id, receiver_public_id, content):
    """Use with socket to save new message"""
    new_message = Message(
        sender_public_id = sender_public_id,
        receiver_public_id = receiver_public_id,
        content = content,
        created_at = datetime.datetime.utcnow()
    )

    save_changes(new_message)


def save_changes(data=None):
    if data != None:
        db.session.add(data)
        db.session.commit()
    else:
        db.session.commit()