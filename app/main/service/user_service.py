
import uuid
import datetime

from app.main import db
from app.main.model.user import User

from ..config import admin_key

def save_new_user(data):
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        new_user = User(
            public_id=str(uuid.uuid4()),
            email=data['email'],
            username=data['username'],
            password=data['password'],
            registered_on=datetime.datetime.utcnow()
        )
        save_changes(new_user)
        return generate_token(new_user)
        
    response_object = {
        'status': 'fail',
        'message': 'User already exists. Please Log in.',
    }
    return response_object, 409


def save_updated_user(user, data):
    if 'email' in data.keys():
        check_email = User.query.filter_by(email=data['email']).first()
        if check_email:
            response_object = {
                'status': 'fail',
                'message': 'Email address has been taken.',
            }
            return response_object, 409
        user.email = data['email']

    if 'username' in data.keys():
        user.username = data['username']

    if 'password' in data.keys():
        user.password = data['password']

    save_changes(user)
    response_object = {
        'status': 'success',
        'message': 'Successfully updated.'
    }
    return response_object, 200


def update_admin_user(user, key):
    print(key, admin_key)
    if key == admin_key:
        user.admin = True
        save_changes(user)
        response_object = {
            'status': 'success',
            'message': 'Successfully updated.'
        }
        return response_object, 200

    response_object = {
        'status': 'fail',
        'message': 'The admin secret key not right.'
    }
    return response_object, 403


def get_all_users():
    return User.query.all()


def get_a_user(public_id):
    return User.query.filter_by(public_id=public_id).first()


def save_changes(data):
    db.session.add(data)
    db.session.commit()


def generate_token(user):
    try:
        # generate the auth token
        auth_token = user.encode_auth_token(user.id)
        response_object = {
            'status': 'success',
            'message': 'Successfully registered.',
            'Authorization': auth_token.decode()
        }
        return response_object, 201

    except Exception as e:
        response_object = {
            'status': 'fail',
            'message': e
        }
        return response_object, 500