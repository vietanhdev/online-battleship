import datetime

from app.main import db
from app.main.model.message import Message

from sqlalchemy import or_, and_


def get_messages(self_public_id, partner_public_id):
    messages = Message.query.filter( or_( and_(Message.sender_public_id==self_public_id, Message.receiver_public_id==partner_public_id) | and_(Message.sender_public_id==partner_public_id, Message.receiver_public_id==self_public_id) ) ).order_by(Message.created_at.desc()).all()
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