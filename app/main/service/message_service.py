import datetime

from app.main import db
from app.main.model.message import Message

from sqlalchemy import or_, and_


def get_private_messages(self_public_id, partner_public_id, offset, limit):
    if offset.isdigit() and limit.isdigit():
        offset = int(offset)
        limit = int(limit)
        messages = Message.query.filter( or_( and_(Message.sender_public_id==self_public_id, Message.receiver_public_id==partner_public_id) | and_(Message.sender_public_id==partner_public_id, Message.receiver_public_id==self_public_id) ) ).order_by(Message.created_at.desc()).offset(offset).limit(limit).all()

        data = []
        if messages:
            for message in messages:
                data.append(message.get_message_information())
        
        response_object = {
            'status': 'success',
            'data': data
        }
        return response_object, 200

    response_object = {
        'status': 'fail',
        'message': 'offset and limit must be a positive integer'
    }
    return response_object, 400


def get_room_messages(room_public_id, offset, limit):
    if offset.isdigit() and limit.isdigit():
        offset = int(offset)
        limit = int(limit)
        messages = Message.query.filter(Message.receiver_public_id==room_public_id).order_by(Message.created_at.desc()).offset(offset).limit(limit).all()

        data = []
        if messages:
            for message in messages:
                data.append(message.get_message_information())
        
        response_object = {
            'status': 'success',
            'data': data
        }
        return response_object, 200

    response_object = {
        'status': 'fail',
        'message': 'offset and limit must be a positive integer'
    }
    return response_object, 400


def save_new_message(sender_public_id, receiver_public_id, content):
    """Use with socket to save new message"""
    new_message = Message(
        sender_public_id = sender_public_id,
        receiver_public_id = receiver_public_id,
        content = content,
        created_at = datetime.datetime.utcnow()
    )

    save_changes(new_message)

    return new_message


def save_changes(data=None):
    if data != None:
        db.session.add(data)
        db.session.commit()
    else:
        db.session.commit()